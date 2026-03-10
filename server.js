/**
 * GimJector — Bridge Server v6.0.0
 *
 * New in v6:
 *  - Auto-reconnect: dropped bots respawn automatically
 *  - Chat spam: all bots send a configurable message on an interval
 *  - Random name generation (adjective + noun combos)
 *  - JID caching with TTL (re-fetched if >2 min old)
 *  - Per-bot status events for the live bot grid
 *  - Retry logic: fresh JID + retry on matchmaker 500
 */

import express               from 'express';
import http                  from 'http';
import path                  from 'path';
import { fileURLToPath }     from 'url';
import fetch                 from 'node-fetch';
import { parse as parseHtml} from 'node-html-parser';
import StegCloak             from 'stegcloak';
import { WebSocketServer, WebSocket } from 'ws';
import { encode as blueboatEncode }   from './network/blueboat.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT      = process.env.PORT || 3000;

const app    = express();
const server = http.createServer(app);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (_req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

/* ─────────────────────────────────────────────────────────────
   RANDOM NAME GENERATOR
───────────────────────────────────────────────────────────── */
const ADJECTIVES = [
  'Angry','Brave','Calm','Dark','Epic','Fast','Goofy','Happy','Icy','Jolly',
  'Kind','Lazy','Mean','Nice','Odd','Pale','Quick','Rude','Sly','Tiny',
  'Ultra','Vast','Wild','Zany','Bold','Cool','Dumb','Evil','Fake','Glad',
];
const NOUNS = [
  'Axe','Bear','Cat','Dog','Egg','Fox','Gnu','Hog','Imp','Jay',
  'Koi','Leo','Moo','Nit','Owl','Pig','Rat','Spy','Tux','Urn',
  'Van','Wolf','Yak','Zap','Ace','Bug','Cow','Doe','Elf','Fly',
];

function randomName() {
  const adj  = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num  = Math.floor(Math.random() * 99) + 1;
  return `${adj}${noun}${num}`;
}

/* ─────────────────────────────────────────────────────────────
   JID CACHE  (TTL: 2 minutes)
───────────────────────────────────────────────────────────── */
let jidCache      = null;
let jidFetchedAt  = 0;
const JID_TTL_MS  = 2 * 60 * 1000;

async function getJID(force = false) {
  const now = Date.now();
  if (!force && jidCache && (now - jidFetchedAt) < JID_TTL_MS) return jidCache;

  const res  = await fetch('https://www.gimkit.com/join');
  const html = await res.text();
  const root = parseHtml(html);
  const meta = root.querySelector("meta[property='int:jid']");
  if (!meta) throw new Error("No <meta property='int:jid'> on gimkit.com/join");

  jidCache     = meta.getAttribute('content').split('').reverse().join('');
  jidFetchedAt = Date.now();
  console.log('[JID] refreshed:', jidCache);
  return jidCache;
}

/* ─────────────────────────────────────────────────────────────
   BROWSER ↔ SERVER WEBSOCKET
───────────────────────────────────────────────────────────── */
const wss = new WebSocketServer({ server });

function toBrowser(ws, type, payload = {}) {
  if (ws.readyState === WebSocket.OPEN)
    ws.send(JSON.stringify({ type, ...payload }));
}

wss.on('connection', (browserWs) => {
  console.log('[Server] Browser connected');

  // Session state
  const bots        = new Map();   // id → Bot
  let   botIdSeq    = 0;
  let   flooding    = false;
  let   floodCode   = null;
  let   floodConfig = {};
  let   spamTimer   = null;

  function broadcastStats() {
    const total = bots.size;
    const alive = [...bots.values()].filter(b => b.alive).length;
    toBrowser(browserWs, 'stats', { total, alive, failed: total - alive });
  }

  function startSpam(message, intervalMs) {
    if (spamTimer) { clearInterval(spamTimer); spamTimer = null; }
    if (!message || intervalMs < 500) return;
    spamTimer = setInterval(() => {
      let sent = 0;
      for (const bot of bots.values()) {
        if (bot.alive) { bot.sendChat(message); sent++; }
      }
      if (sent > 0)
        toBrowser(browserWs, 'log', { level: 'chat', msg: `Spam sent by ${sent} bots: "${message}"` });
    }, intervalMs);
  }

  async function spawnBot(name, retries = 2) {
    const id  = ++botIdSeq;
    const bot = new Bot(id, name, browserWs, () => {
      // On drop callback
      broadcastStats();
      toBrowser(browserWs, 'botUpdate', { id, name, state: 'dropped' });

      // Auto-reconnect if still flooding
      if (flooding && floodConfig.autoReconnect) {
        setTimeout(async () => {
          if (!flooding) return;
          toBrowser(browserWs, 'log', { level: 'warn', msg: `Reconnecting "${name}"…` });
          try {
            const jid = await getJID();
            await bot.spawn(floodCode, jid);
            broadcastStats();
            toBrowser(browserWs, 'botUpdate', { id, name, state: 'alive' });
          } catch (e) {
            toBrowser(browserWs, 'log', { level: 'error', msg: `Reconnect "${name}" failed: ${e.message}` });
            toBrowser(browserWs, 'botUpdate', { id, name, state: 'failed' });
          }
        }, 2000);
      }
    });

    bots.set(id, bot);
    toBrowser(browserWs, 'botUpdate', { id, name, state: 'connecting' });

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Refresh JID on retry
        const jid = await getJID(attempt > 0);
        await bot.spawn(floodCode, jid);
        toBrowser(browserWs, 'botUpdate', { id, name, state: 'alive' });
        broadcastStats();
        return;
      } catch (e) {
        if (attempt < retries) {
          toBrowser(browserWs, 'log', { level: 'warn', msg: `"${name}" retry ${attempt + 1}: ${e.message}` });
          await sleep(500 * (attempt + 1));
        } else {
          toBrowser(browserWs, 'log', { level: 'error', msg: `"${name}" failed after ${retries + 1} attempts: ${e.message}` });
          toBrowser(browserWs, 'botUpdate', { id, name, state: 'failed' });
          bots.delete(id);
          broadcastStats();
        }
      }
    }
  }

  browserWs.on('message', async (raw) => {
    let msg;
    try { msg = JSON.parse(raw.toString()); } catch { return; }

    switch (msg.type) {

      case 'flood': {
        if (flooding) { toBrowser(browserWs, 'error', { message: 'Already flooding. Stop first.' }); return; }
        const { code, namePrefix, randomNames, count, delay,
                autoReconnect, spamMessage, spamInterval } = msg;

        if (!code)  { toBrowser(browserWs, 'error', { message: 'No game code.' }); return; }
        if (!count) { toBrowser(browserWs, 'error', { message: 'No bot count.' }); return; }

        flooding    = true;
        floodCode   = code.trim();
        floodConfig = { autoReconnect: !!autoReconnect };

        bots.clear();
        botIdSeq = 0;

        toBrowser(browserWs, 'status', { state: 'flooding', message: `Flooding ${floodCode} with ${count} bots…` });
        toBrowser(browserWs, 'log',    { level: 'system', msg: `Starting flood — ${count} bots, ${delay}ms stagger` });

        // Pre-warm JID
        try {
          await getJID(true);
          toBrowser(browserWs, 'log', { level: 'system', msg: 'JID ready ✓' });
        } catch (e) {
          toBrowser(browserWs, 'error', { message: `JID fetch failed: ${e.message}` });
          flooding = false;
          return;
        }

        // Spawn bots
        for (let i = 0; i < count; i++) {
          if (!flooding) break;
          const name = randomNames ? randomName() : `${namePrefix ?? 'Bot'}${i + 1}`;
          spawnBot(name).catch(() => {});
          if (i < count - 1) await sleep(delay ?? 300);
        }

        // Start chat spam if configured
        if (spamMessage && spamInterval) {
          startSpam(spamMessage, spamInterval);
          toBrowser(browserWs, 'log', { level: 'system',
            msg: `Chat spam enabled: "${spamMessage}" every ${spamInterval}ms` });
        }
        break;
      }

      case 'spam': {
        // Toggle/update spam without restarting the flood
        const { message, intervalMs } = msg;
        startSpam(message, intervalMs);
        toBrowser(browserWs, 'log', { level: 'system',
          msg: message ? `Spam updated: "${message}" every ${intervalMs}ms` : 'Spam stopped' });
        break;
      }

      case 'stop': {
        flooding = false;
        if (spamTimer) { clearInterval(spamTimer); spamTimer = null; }
        const killed = bots.size;
        bots.forEach(b => b.disconnect());
        bots.clear();
        toBrowser(browserWs, 'status',  { state: 'idle', message: `Stopped — ${killed} bots disconnected` });
        toBrowser(browserWs, 'stats',   { total: 0, alive: 0, failed: 0 });
        toBrowser(browserWs, 'clearBots');
        break;
      }
    }
  });

  browserWs.on('close', () => {
    flooding = false;
    if (spamTimer) { clearInterval(spamTimer); spamTimer = null; }
    bots.forEach(b => b.disconnect());
    bots.clear();
  });
});

/* ─────────────────────────────────────────────────────────────
   BOT
───────────────────────────────────────────────────────────── */
class Bot {
  constructor(id, name, browserWs, onDrop) {
    this.id         = id;
    this.name       = name;
    this.browserWs  = browserWs;
    this.onDrop     = onDrop;
    this.ws         = null;
    this.alive      = false;
    this._heartbeat = null;
  }

  async spawn(code, jid) {
    // Step 1: roomId
    const infoRes = await fetch(
      'https://www.gimkit.com/api/matchmaker/find-info-from-code',
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) }
    );
    const info = await infoRes.json();
    if (info.code === 404 || !infoRes.ok) throw new Error(`Game "${code}" not found`);
    const roomId = info.roomId ?? info.room?.roomId;
    if (!roomId) throw new Error('No roomId');

    // Step 2: unique clientType per bot (random AES salt baked in by StegCloak)
    const clientType = new StegCloak(true, false).hide(jid, 'BSKA', 'Gimkit Web Client V3.1');

    // Step 3: matchmaker/join
    const joinRes = await fetch('https://www.gimkit.com/api/matchmaker/join', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin':       'https://www.gimkit.com',
        'Referer':      'https://www.gimkit.com/join',
      },
      body: JSON.stringify({ clientType, name: this.name, roomId }),
    });
    const joinText = await joinRes.text();
    if (!joinRes.ok) throw new Error(`matchmaker/join ${joinRes.status}: ${joinText.slice(0, 120)}`);

    const join      = JSON.parse(joinText);
    const finalRoom = join.roomId ?? roomId;
    if (!join.serverUrl) throw new Error('No serverUrl');

    if (join.source === 'original') {
      await this._blueboat(join.serverUrl, finalRoom, join.intentId);
    } else {
      await this._colyseus(join.serverUrl, finalRoom, join.intentId);
    }
  }

  _blueboat(serverUrl, roomId, intentId) {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss${serverUrl.substr(5)}/blueboat/?id=&EIO=3&transport=websocket`;
      const ws    = new WebSocket(wsUrl, {
        headers: {
          'Origin':     'https://www.gimkit.com',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36',
        },
      });
      this.ws = ws;

      const timeout = setTimeout(() => { ws.terminate(); reject(new Error(`"${this.name}" timed out`)); }, 15_000);

      ws.on('open', () => {
        clearTimeout(timeout);
        ws.send(blueboatEncode({ roomId, options: { intent: intentId } }));
        this._heartbeat = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) ws.send('2');
        }, 25_000);
      });

      ws.on('message', (data) => {
        if (this.alive) return;
        const raw = data.toString();
        if (raw.startsWith('0') || raw.startsWith('40') || Buffer.isBuffer(data)) {
          this.alive = true;
          this._log('system', `✓ "${this.name}" joined`);
          resolve();
        }
      });

      ws.on('error', (err) => { clearTimeout(timeout); reject(new Error(err.message)); });

      ws.on('close', (code) => {
        clearTimeout(timeout);
        if (this._heartbeat) { clearInterval(this._heartbeat); this._heartbeat = null; }
        if (this.alive) {
          this.alive = false;
          this._log('warn', `"${this.name}" dropped (${code})`);
          if (this.onDrop) this.onDrop();
        }
      });
    });
  }

  async _colyseus(serverUrl, roomId, intentId) {
    const seatRes = await fetch(`${serverUrl}/matchmake/joinById/${roomId}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ intentId }),
    });
    const seat = await seatRes.json();
    if (!seat.sessionId) throw new Error('Colyseus: no sessionId');

    const wsUrl = `wss${serverUrl.substr(5)}/${seat.room.processId}/${seat.room.roomId}?sessionId=${seat.sessionId}`;
    return new Promise((resolve, reject) => {
      const ws      = new WebSocket(wsUrl, { headers: { Origin: 'https://www.gimkit.com' } });
      this.ws       = ws;
      const timeout = setTimeout(() => { ws.terminate(); reject(new Error('Colyseus timeout')); }, 10_000);

      ws.once('message', (data) => {
        clearTimeout(timeout);
        if (data.toString().includes('"type":"FULL"')) { ws.close(); reject(new Error('Room full')); return; }
        this.alive = true;
        this._log('system', `✓ "${this.name}" joined (Colyseus)`);
        resolve();
      });

      ws.on('error', (err) => { clearTimeout(timeout); reject(new Error(err.message)); });
      ws.on('close', (code) => {
        if (this._heartbeat) { clearInterval(this._heartbeat); this._heartbeat = null; }
        if (this.alive) {
          this.alive = false;
          this._log('warn', `"${this.name}" dropped (${code})`);
          if (this.onDrop) this.onDrop();
        }
      });
    });
  }

  sendChat(text) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send('42' + JSON.stringify(['chat', { message: text }]));
    }
  }

  disconnect() {
    if (this._heartbeat) { clearInterval(this._heartbeat); this._heartbeat = null; }
    if (this.ws) { this.ws.terminate(); this.ws = null; }
    this.alive = false;
  }

  _log(level, msg) { toBrowser(this.browserWs, 'log', { level, msg }); }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

server.listen(PORT, () => {
  console.log(`\n╔══════════════════════════════════════════╗`);
  console.log(`║  GimJector  v6.0.0                      ║`);
  console.log(`╠══════════════════════════════════════════╣`);
  console.log(`║  http://localhost:${PORT}                   ║`);
  console.log(`╚══════════════════════════════════════════╝\n`);
});
