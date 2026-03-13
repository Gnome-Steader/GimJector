#!/usr/bin/env node
/**
 * build-console.js
 * Assembles console-script.js from its source parts.
 * Run: node build-console.js  (or npm run build:console)
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const lzutf8Min = readFileSync(
  path.join(__dirname, 'node_modules/lzutf8/build/production/lzutf8.min.js'),
  'utf8'
);

const blueboatSrc = readFileSync(
  path.join(__dirname, 'network/blueboat.js'),
  'utf8'
);

// Strip the ES-module export keyword so the function works as a plain global
const blueboatInline = blueboatSrc
  .replace(/\bexport function encode\b/, 'function _blueboatEncode')
  .replace(/^function n\b/m,             'function _blueboatN')
  .replace(/\bn\(/g,                     '_blueboatN(');

const banner = `/* ====================================================================
   GimJector — Browser Console Script v6.0.0
   Paste this into your browser console while on any gimkit.com page.
   No server / VPS required — runs entirely in the browser.
   ==================================================================== */`;

const consoleScript = `${banner}
(async function GimJector() {
  'use strict';

  if (window.__GimJector) {
    console.info('[GimJector] Already running. Use window.__GimJector to control it.');
    return;
  }

  /* ── lzutf8 (inlined browser build — used by StegCloak) ──────────── */
  (function(){
${lzutf8Min}
  })();
  const _lz = (typeof LZUTF8 !== 'undefined') ? LZUTF8
    : (typeof module !== 'undefined' ? module.exports : null);
  if (!_lz) { console.error('[GimJector] lzutf8 failed to load'); return; }

  /* ── Blueboat msgpack encoder (inline) ───────────────────────────── */
${blueboatInline}

  /* ── StegCloak .hide() — Web-Crypto re-implementation ────────────── */
  // Implements exactly the same algorithm as stegcloak@1.1.1 hide(msg,pw,cover)
  // with encrypt=true, integrity=false so Gimkit can validate the clientType.
  const _ZWC = ['\\u200C','\\u200D','\\u2061','\\u2062','\\u2063','\\u2064'];

  function _zwcFindOptimal(stream) {
    const chars = _ZWC.slice(0, 4);
    const score = Object.fromEntries(chars.map(c => [c, {}]));
    for (let j = 0; j < stream.length; j++) {
      let run = 1;
      while (j < stream.length - 1 && stream[j] === stream[j + 1]) { run++; j++; }
      if (run >= 2 && chars.includes(stream[j])) {
        for (let k = 2; k <= run; k++) {
          score[stream[j]][k] = (score[stream[j]][k] || 0) + Math.floor(run / k) * (k - 1);
        }
      }
    }
    let ranked = [];
    for (const c of chars) for (const k in score[c]) ranked.push([c, +k, score[c][k]]);
    ranked.sort((a, b) => b[2] - a[2]);
    let top2 = ranked.filter(r => r[1] === 2).slice(0, 2).map(r => r[0]);
    if (top2.length < 2) top2 = top2.concat(chars.filter(c => !top2.includes(c))).slice(0, 2);
    return top2.slice().sort();
  }

  function _zwcShrink(stream) {
    const tableMap = [
      _ZWC[0]+_ZWC[1], _ZWC[0]+_ZWC[2], _ZWC[0]+_ZWC[3],
      _ZWC[1]+_ZWC[2], _ZWC[1]+_ZWC[3], _ZWC[2]+_ZWC[3],
    ];
    const [r0, r1] = _zwcFindOptimal(stream);
    const flag = _ZWC[tableMap.indexOf(r0 + r1)];
    // recursiveReplace processes from last to first (Ramda dropLast order)
    let out = stream
      .replace(new RegExp(r1 + r1, 'g'), _ZWC[5])
      .replace(new RegExp(r0 + r0, 'g'), _ZWC[4]);
    return flag + out;
  }

  async function _stegHide(message, password, cover) {
    // 1. LZ-UTF8 compress
    const compressed = _lz.compress(message, { outputEncoding: 'Buffer' });

    // 2. Bitwise-NOT each byte (StegCloak "compliment" step)
    const complemented = new Uint8Array(compressed.length);
    for (let i = 0; i < compressed.length; i++) complemented[i] = (~compressed[i]) & 0xFF;

    // 3. AES-256-CTR encrypt with PBKDF2-derived key (matches stegcloak encrypt.js)
    const salt = crypto.getRandomValues(new Uint8Array(8));
    const pwBytes = new TextEncoder().encode(password);
    const keyMat = await crypto.subtle.importKey('raw', pwBytes, 'PBKDF2', false, ['deriveBits']);
    const derived = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations: 10000, hash: 'SHA-512' },
      keyMat, 384               // 48 bytes = iv(16) + key(32)
    );
    const iv  = new Uint8Array(derived, 0, 16);
    const aesKey = await crypto.subtle.importKey(
      'raw', new Uint8Array(derived, 16, 32),
      { name: 'AES-CTR' }, false, ['encrypt']
    );
    const cipherBuf = await crypto.subtle.encrypt(
      { name: 'AES-CTR', counter: iv, length: 128 }, aesKey, complemented
    );

    // 4. payload = salt || ciphertext
    const payload = new Uint8Array(8 + cipherBuf.byteLength);
    payload.set(salt);
    payload.set(new Uint8Array(cipherBuf), 8);

    // 5. Bytes → binary string
    let binStr = '';
    for (const b of payload) binStr += b.toString(2).padStart(8, '0');

    // 6. Binary → ZWC (flag = ZWC[1] for crypt=true, integrity=false)
    let stream = _ZWC[1];
    for (let i = 0; i < binStr.length; i += 2) stream += _ZWC[parseInt(binStr[i] + binStr[i + 1], 2)];

    // 7. Shrink (ZWC run-length compression)
    stream = _zwcShrink(stream);

    // 8. Embed into cover text (StegCloak embed())
    const words = cover.split(' ');
    const idx   = Math.floor(Math.random() * Math.floor(words.length / 2));
    return words.slice(0, idx + 1).concat([stream + words[idx + 1]]).concat(words.slice(idx + 2)).join(' ');
  }

  /* ── JID helper ──────────────────────────────────────────────────── */
  let _jidCache = null, _jidAt = 0;
  async function _getJID(force = false) {
    const now = Date.now();
    if (!force && _jidCache && now - _jidAt < 120_000) return _jidCache;
    const meta = document.querySelector("meta[property='int:jid']");
    if (meta) {
      _jidCache = meta.getAttribute('content').split('').reverse().join('');
      _jidAt    = Date.now();
      return _jidCache;
    }
    const res  = await fetch('/join');
    const html = await res.text();
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    const m    = doc.querySelector("meta[property='int:jid']");
    if (!m) throw new Error("No JID meta tag found on gimkit.com/join");
    _jidCache = m.getAttribute('content').split('').reverse().join('');
    _jidAt    = Date.now();
    return _jidCache;
  }

  /* ── Name generator ──────────────────────────────────────────────── */
  const _ADJ  = ['Angry','Brave','Calm','Dark','Epic','Fast','Goofy','Happy','Icy','Jolly',
    'Kind','Lazy','Mean','Nice','Odd','Pale','Quick','Rude','Sly','Tiny',
    'Ultra','Vast','Wild','Zany','Bold','Cool','Dumb','Evil','Fake','Glad'];
  const _NOUN = ['Axe','Bear','Cat','Dog','Egg','Fox','Gnu','Hog','Imp','Jay',
    'Koi','Leo','Moo','Nit','Owl','Pig','Rat','Spy','Tux','Urn',
    'Van','Wolf','Yak','Zap','Ace','Bug','Cow','Doe','Elf','Fly'];
  const _rand = arr => arr[Math.floor(Math.random() * arr.length)];
  function _randomName() { return \`\${_rand(_ADJ)}\${_rand(_NOUN)}\${Math.floor(Math.random()*99)+1}\`; }
  const _sleep = ms => new Promise(r => setTimeout(r, ms));

  /* ── Bot ─────────────────────────────────────────────────────────── */
  class Bot {
    constructor(name, onLog, onDrop) {
      this.name       = name;
      this.ws         = null;
      this.alive      = false;
      this._hb        = null;
      this._onLog     = onLog;
      this._onDrop    = onDrop;
    }

    async spawn(code) {
      const jid = await _getJID();

      // 1. Find room
      const infoRes = await fetch('/api/matchmaker/find-info-from-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      const info = await infoRes.json();
      if (info.code === 404 || !infoRes.ok) throw new Error(\`Game "\${code}" not found\`);
      const roomId = info.roomId ?? info.room?.roomId;
      if (!roomId) throw new Error('No roomId');

      // 2. Build clientType
      const clientType = await _stegHide(jid, 'BSKA', 'Gimkit Web Client V3.1');

      // 3. Join matchmaker
      const joinRes = await fetch('/api/matchmaker/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientType, name: this.name, roomId }),
      });
      const joinText = await joinRes.text();
      if (!joinRes.ok) throw new Error(\`matchmaker/join \${joinRes.status}: \${joinText.slice(0, 120)}\`);

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
        const wsUrl = \`wss\${serverUrl.substr(5)}/blueboat/?id=&EIO=3&transport=websocket\`;
        const ws    = new WebSocket(wsUrl);
        this.ws     = ws;

        const timeout = setTimeout(() => { ws.close(); reject(new Error(\`"\${this.name}" timed out\`)); }, 15_000);

        ws.onopen = () => {
          clearTimeout(timeout);
          ws.send(_blueboatEncode({ roomId, options: { intent: intentId } }));
          this._hb = setInterval(() => { if (ws.readyState === WebSocket.OPEN) ws.send('2'); }, 25_000);
        };

        ws.onmessage = (e) => {
          if (this.alive) return;
          const raw = typeof e.data === 'string' ? e.data : '';
          if (raw.startsWith('0') || raw.startsWith('40') || e.data instanceof ArrayBuffer) {
            this.alive = true;
            this._onLog('system', \`✓ "\${this.name}" joined\`);
            resolve();
          }
        };

        ws.onerror = (e) => { clearTimeout(timeout); reject(new Error('WebSocket error')); };

        ws.onclose = (e) => {
          clearTimeout(timeout);
          if (this._hb) { clearInterval(this._hb); this._hb = null; }
          if (this.alive) {
            this.alive = false;
            this._onLog('warn', \`"\${this.name}" dropped (\${e.code})\`);
            if (this._onDrop) this._onDrop();
          }
        };
      });
    }

    async _colyseus(serverUrl, roomId, intentId) {
      const seatRes = await fetch(\`\${serverUrl}/matchmake/joinById/\${roomId}\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ intentId }),
      });
      const seat = await seatRes.json();
      if (!seat.sessionId) throw new Error('Colyseus: no sessionId');

      const wsUrl = \`wss\${serverUrl.substr(5)}/\${seat.room.processId}/\${seat.room.roomId}?sessionId=\${seat.sessionId}\`;
      return new Promise((resolve, reject) => {
        const ws      = new WebSocket(wsUrl);
        this.ws       = ws;
        const timeout = setTimeout(() => { ws.close(); reject(new Error('Colyseus timeout')); }, 10_000);

        ws.onmessage = (e) => {
          clearTimeout(timeout);
          const txt = typeof e.data === 'string' ? e.data : '';
          if (txt.includes('"type":"FULL"')) { ws.close(); reject(new Error('Room full')); return; }
          this.alive = true;
          this._onLog('system', \`✓ "\${this.name}" joined (Colyseus)\`);
          resolve();
        };

        ws.onerror = () => { clearTimeout(timeout); reject(new Error('Colyseus WS error')); };

        ws.onclose = (e) => {
          if (this._hb) { clearInterval(this._hb); this._hb = null; }
          if (this.alive) {
            this.alive = false;
            this._onLog('warn', \`"\${this.name}" dropped (\${e.code})\`);
            if (this._onDrop) this._onDrop();
          }
        };
      });
    }

    sendChat(txt) {
      if (this.ws?.readyState === WebSocket.OPEN)
        this.ws.send('42' + JSON.stringify(['chat', { message: txt }]));
    }

    disconnect() {
      if (this._hb) { clearInterval(this._hb); this._hb = null; }
      if (this.ws)  { this.ws.close(); this.ws = null; }
      this.alive = false;
    }
  }

  /* ── Session state ────────────────────────────────────────────────── */
  const _bots      = new Map();
  let   _botSeq    = 0;
  let   _flooding  = false;
  let   _code      = null;
  let   _cfg       = {};
  let   _spamTimer = null;

  /* ── UI helpers ───────────────────────────────────────────────────── */
  let _ui = null;

  function _esc(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function _uiLog(level, msg) {
    if (!_ui) return;
    const log   = _ui.querySelector('#gj-log');
    const entry = document.createElement('div');
    entry.style.cssText = 'display:flex;gap:6px;align-items:flex-start;padding:2px 0';
    const colors = { system:'#4ade80', error:'#f87171', warn:'#fbbf24', chat:'#60a5fa' };
    const now = new Date().toLocaleTimeString('en-US',{hour12:false});
    entry.innerHTML =
      \`<span style="color:#4b5675;flex-shrink:0;font-size:.68rem;margin-top:1px">\${now}</span>\`+
      \`<span style="font-size:.6rem;font-weight:700;padding:2px 5px;border-radius:4px;flex-shrink:0;background:#111;color:\${colors[level]||colors.system}">\${(level||'SYS').toUpperCase()}</span>\`+
      \`<span style="color:#e2e8f0;word-break:break-word;font-size:.78rem">\${_esc(msg)}</span>\`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
  }

  function _uiBotUpdate(id, name, state) {
    if (!_ui) return;
    const grid = _ui.querySelector('#gj-grid');
    const empty = grid.querySelector('#gj-empty');
    if (empty) empty.remove();
    let card = grid.querySelector(\`#gj-bot-\${id}\`);
    if (!card) {
      card = document.createElement('div');
      card.id = \`gj-bot-\${id}\`;
      card.style.cssText = 'padding:6px 8px;border-radius:7px;border:1px solid #1f2340;font-size:.72rem;display:flex;gap:6px;align-items:center;overflow:hidden;transition:border-color .3s';
      card.innerHTML = \`<div class="gj-dot" style="width:6px;height:6px;border-radius:50%;flex-shrink:0"></div><span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis" title="\${_esc(name)}">\${_esc(name)}</span>\`;
      grid.appendChild(card);
    }
    const dotColors = { alive:'#22c55e', failed:'#ef4444', connecting:'#f59e0b', dropped:'#f97316' };
    card.querySelector('.gj-dot').style.background = dotColors[state] || '#4b5675';
  }

  function _uiStats() {
    if (!_ui) return;
    const total  = _bots.size;
    const alive  = [..._bots.values()].filter(b => b.alive).length;
    const failed = total - alive;
    _ui.querySelector('#gj-alive').textContent  = alive;
    _ui.querySelector('#gj-failed').textContent = failed;
    _ui.querySelector('#gj-total').textContent  = total;
  }

  /* ── Flood / stop ─────────────────────────────────────────────────── */
  function _startSpam(message, intervalMs) {
    if (_spamTimer) { clearInterval(_spamTimer); _spamTimer = null; }
    if (!message || intervalMs < 500) return;
    _spamTimer = setInterval(() => {
      let sent = 0;
      for (const b of _bots.values()) { if (b.alive) { b.sendChat(message); sent++; } }
      if (sent > 0) _uiLog('chat', \`Spam sent by \${sent} bots: "\${message}"\`);
    }, intervalMs);
  }

  async function _spawnBot(name, code, retries = 2) {
    const id  = ++_botSeq;
    const bot = new Bot(name, _uiLog, () => {
      _uiStats();
      _uiBotUpdate(id, name, 'dropped');
      if (_flooding && _cfg.autoReconnect) {
        setTimeout(async () => {
          if (!_flooding) return;
          _uiLog('warn', \`Reconnecting "\${name}"…\`);
          try {
            await _getJID(true);
            await bot.spawn(code);
            _uiStats();
            _uiBotUpdate(id, name, 'alive');
          } catch (e) {
            _uiLog('error', \`Reconnect "\${name}" failed: \${e.message}\`);
            _uiBotUpdate(id, name, 'failed');
          }
        }, 2000);
      }
    });
    _bots.set(id, bot);
    _uiBotUpdate(id, name, 'connecting');

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        if (attempt > 0) await _getJID(true);
        await bot.spawn(code);
        _uiBotUpdate(id, name, 'alive');
        _uiStats();
        return;
      } catch (e) {
        if (attempt < retries) {
          _uiLog('warn', \`"\${name}" retry \${attempt + 1}: \${e.message}\`);
          await _sleep(500 * (attempt + 1));
        } else {
          _uiLog('error', \`"\${name}" failed after \${retries + 1} attempts: \${e.message}\`);
          _uiBotUpdate(id, name, 'failed');
          _bots.delete(id);
          _uiStats();
        }
      }
    }
  }

  async function _startFlood(opts) {
    const { code, count = 10, delay = 300, namePrefix = 'Bot',
            randomNames = false, autoReconnect = false,
            spamMessage = null, spamInterval = 3000 } = opts;

    if (_flooding) { _uiLog('error', 'Already flooding — stop first.'); return; }
    if (!code)     { _uiLog('error', 'No game code provided.'); return; }

    _flooding = true;
    _code     = code.trim();
    _cfg      = { autoReconnect };
    _bots.clear();
    _botSeq = 0;

    _uiLog('system', \`Starting flood — \${count} bots, \${delay}ms stagger\`);
    _uiSetState('flooding');

    try {
      await _getJID(true);
      _uiLog('system', 'JID ready ✓');
    } catch (e) {
      _uiLog('error', \`JID fetch failed: \${e.message}\`);
      _flooding = false;
      _uiSetState('idle');
      return;
    }

    for (let i = 0; i < count; i++) {
      if (!_flooding) break;
      const name = randomNames ? _randomName() : \`\${namePrefix}\${i + 1}\`;
      _spawnBot(name, _code).catch(() => {});
      if (i < count - 1) await _sleep(delay);
    }

    if (spamMessage && spamInterval) {
      _startSpam(spamMessage, spamInterval);
      _uiLog('system', \`Chat spam: "\${spamMessage}" every \${spamInterval}ms\`);
    }
  }

  function _stopFlood() {
    _flooding = false;
    if (_spamTimer) { clearInterval(_spamTimer); _spamTimer = null; }
    const n = _bots.size;
    _bots.forEach(b => b.disconnect());
    _bots.clear();
    _uiLog('system', \`Stopped — \${n} bots disconnected\`);
    _uiStats();
    _uiSetState('idle');
    if (_ui) {
      const grid = _ui.querySelector('#gj-grid');
      grid.innerHTML = '<span id="gj-empty" style="color:#4b5675;font-size:.8rem">No bots spawned yet.</span>';
    }
  }

  function _uiSetState(state) {
    if (!_ui) return;
    const flooding = state === 'flooding';
    _ui.querySelector('#gj-btn-flood').disabled = flooding;
    _ui.querySelector('#gj-btn-stop').disabled  = !flooding;
    const dot = _ui.querySelector('#gj-dot');
    dot.style.background = flooding ? '#f59e0b' : state === 'idle' ? '#4b5675' : '#ef4444';
  }

  /* ── UI ───────────────────────────────────────────────────────────── */
  function _createUI() {
    const panel = document.createElement('div');
    panel.id = 'gimjector-panel';
    panel.style.cssText = [
      'position:fixed;top:20px;right:20px;z-index:2147483647',
      'width:320px;background:#0f1120;color:#e2e8f0',
      'border:1px solid #1f2340;border-radius:14px',
      'font-family:Segoe UI,system-ui,sans-serif;font-size:.82rem',
      'box-shadow:0 8px 32px rgba(0,0,0,.6)',
      'display:flex;flex-direction:column;overflow:hidden',
    ].join(';');

    panel.innerHTML = \`
<div id="gj-header" style="background:#080a12;padding:10px 14px;display:flex;align-items:center;gap:10px;cursor:grab;border-bottom:1px solid #1f2340;user-select:none">
  <span style="font-size:1rem;font-weight:800;letter-spacing:-.3px">Gim<span style="color:#7c6dfa">Jector</span></span>
  <span style="font-size:.6rem;background:#1f2340;color:#4b5675;padding:2px 7px;border-radius:99px;font-weight:600">v6.0</span>
  <div id="gj-dot" style="width:7px;height:7px;border-radius:50%;background:#4b5675;margin-left:auto"></div>
  <button id="gj-close" style="background:none;border:none;color:#4b5675;cursor:pointer;font-size:1rem;padding:0;line-height:1">✕</button>
</div>

<div style="padding:12px 14px;display:flex;flex-direction:column;gap:10px;max-height:80vh;overflow-y:auto">

  <!-- Stats -->
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px">
    <div style="background:#13162a;border:1px solid #1f2340;border-radius:8px;padding:8px;text-align:center">
      <div id="gj-alive"  style="font-size:1.2rem;font-weight:800;color:#22c55e">0</div>
      <div style="font-size:.58rem;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Alive</div>
    </div>
    <div style="background:#13162a;border:1px solid #1f2340;border-radius:8px;padding:8px;text-align:center">
      <div id="gj-failed" style="font-size:1.2rem;font-weight:800;color:#ef4444">0</div>
      <div style="font-size:.58rem;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Failed</div>
    </div>
    <div style="background:#13162a;border:1px solid #1f2340;border-radius:8px;padding:8px;text-align:center">
      <div id="gj-total"  style="font-size:1.2rem;font-weight:800;color:#a78bfa">0</div>
      <div style="font-size:.58rem;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Total</div>
    </div>
  </div>

  <!-- Game code -->
  <div style="display:flex;flex-direction:column;gap:4px">
    <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Game Code</label>
    <input id="gj-code" type="text" placeholder="e.g. 123456" maxlength="10"
      style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
  </div>

  <!-- Name / random toggle -->
  <div style="display:flex;align-items:center;justify-content:space-between;background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:7px 10px">
    <span>Random names</span>
    <div id="gj-tgl-rand" style="width:32px;height:18px;background:#1f2340;border-radius:99px;cursor:pointer;position:relative;flex-shrink:0;transition:background .2s">
      <div style="position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s"></div>
    </div>
  </div>
  <div id="gj-prefix-row" style="display:flex;flex-direction:column;gap:4px">
    <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Name Prefix</label>
    <input id="gj-prefix" type="text" value="Bot" maxlength="16"
      style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
  </div>

  <!-- Count / delay -->
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
    <div style="display:flex;flex-direction:column;gap:4px">
      <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Bot Count</label>
      <input id="gj-count" type="number" value="10" min="1" max="200"
        style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px">
      <label style="font-size:.65rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Delay (ms)</label>
      <input id="gj-delay" type="number" value="300" min="0" max="5000"
        style="background:#13162a;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
    </div>
  </div>

  <!-- Auto-reconnect -->
  <div style="display:flex;align-items:center;justify-content:space-between;background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:7px 10px">
    <span>Auto-reconnect</span>
    <div id="gj-tgl-reconn" style="width:32px;height:18px;background:#1f2340;border-radius:99px;cursor:pointer;position:relative;flex-shrink:0;transition:background .2s">
      <div style="position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s"></div>
    </div>
  </div>

  <!-- Flood / Stop -->
  <div style="display:flex;gap:6px">
    <button id="gj-btn-flood" style="flex:1;padding:9px;background:#7c6dfa;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.82rem">🚀 Flood</button>
    <button id="gj-btn-stop"  style="flex:1;padding:9px;background:#ef4444;color:#fff;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-size:.82rem" disabled>⛔ Stop</button>
  </div>

  <!-- Chat spam -->
  <details style="background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:0">
    <summary style="padding:7px 10px;cursor:pointer;font-weight:600;list-style:none;color:#a78bfa">▸ Chat Spam</summary>
    <div style="padding:0 10px 10px;display:flex;flex-direction:column;gap:6px;margin-top:6px">
      <input id="gj-spam-msg" type="text" placeholder="hi everyone" maxlength="100"
        style="background:#0f1120;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;align-items:end">
        <div style="display:flex;flex-direction:column;gap:3px">
          <label style="font-size:.6rem;font-weight:600;color:#4b5675;text-transform:uppercase;letter-spacing:.5px">Interval (ms)</label>
          <input id="gj-spam-int" type="number" value="3000" min="500"
            style="background:#0f1120;border:1px solid #1f2340;border-radius:7px;color:#e2e8f0;padding:7px 10px;font-size:.82rem;outline:none;width:100%;box-sizing:border-box"/>
        </div>
        <button id="gj-btn-spam" style="padding:7px;background:#3b82f6;color:#fff;border:none;border-radius:7px;font-weight:700;cursor:pointer;font-size:.76rem">▶ Start</button>
      </div>
    </div>
  </details>

  <!-- Bot grid -->
  <details open style="background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:0">
    <summary style="padding:7px 10px;cursor:pointer;font-weight:600;list-style:none;color:#a78bfa">▸ Bot Grid</summary>
    <div id="gj-grid" style="padding:6px 10px 10px;display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:5px;max-height:140px;overflow-y:auto">
      <span id="gj-empty" style="color:#4b5675;font-size:.8rem">No bots spawned yet.</span>
    </div>
  </details>

  <!-- Log -->
  <details style="background:#13162a;border:1px solid #1f2340;border-radius:7px;padding:0">
    <summary style="padding:7px 10px;cursor:pointer;font-weight:600;list-style:none;color:#a78bfa">▸ Log</summary>
    <div id="gj-log" style="padding:6px 10px 10px;max-height:150px;overflow-y:auto;display:flex;flex-direction:column;gap:1px"></div>
  </details>

</div>
\`;

    // Wire up events
    let randOn = false, reconnOn = false, spamOn = false;

    function _toggle(el, state) {
      el.style.background = state ? '#7c6dfa' : '#1f2340';
      el.querySelector('div').style.transform = state ? 'translateX(14px)' : '';
    }

    panel.querySelector('#gj-tgl-rand').onclick = () => {
      randOn = !randOn;
      _toggle(panel.querySelector('#gj-tgl-rand'), randOn);
      panel.querySelector('#gj-prefix-row').style.display = randOn ? 'none' : '';
    };

    panel.querySelector('#gj-tgl-reconn').onclick = () => {
      reconnOn = !reconnOn;
      _toggle(panel.querySelector('#gj-tgl-reconn'), reconnOn);
    };

    panel.querySelector('#gj-btn-flood').onclick = async () => {
      const code  = panel.querySelector('#gj-code').value.trim();
      const count = parseInt(panel.querySelector('#gj-count').value) || 10;
      const delay = parseInt(panel.querySelector('#gj-delay').value) ?? 300;
      const pfx   = panel.querySelector('#gj-prefix').value.trim() || 'Bot';
      const smsg  = panel.querySelector('#gj-spam-msg').value.trim();
      const sint  = parseInt(panel.querySelector('#gj-spam-int').value) || 3000;
      if (!code) { _uiLog('error', 'Enter a game code first.'); return; }
      await _startFlood({ code, count, delay, namePrefix: pfx,
        randomNames: randOn, autoReconnect: reconnOn,
        spamMessage: spamOn ? smsg : null,
        spamInterval: spamOn ? sint : null });
    };

    panel.querySelector('#gj-btn-stop').onclick = _stopFlood;

    panel.querySelector('#gj-btn-spam').onclick = () => {
      spamOn = !spamOn;
      panel.querySelector('#gj-btn-spam').textContent = spamOn ? '⏹ Stop' : '▶ Start';
      const msg = panel.querySelector('#gj-spam-msg').value.trim();
      const itv = parseInt(panel.querySelector('#gj-spam-int').value) || 3000;
      _startSpam(spamOn ? msg : null, itv);
    };

    panel.querySelector('#gj-close').onclick = () => panel.remove();

    // Drag to move
    const header = panel.querySelector('#gj-header');
    let dragging = false, ox = 0, oy = 0;
    header.addEventListener('mousedown', e => {
      dragging = true; ox = e.clientX - panel.offsetLeft; oy = e.clientY - panel.offsetTop;
      header.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', e => {
      if (!dragging) return;
      panel.style.left  = (e.clientX - ox) + 'px';
      panel.style.top   = (e.clientY - oy) + 'px';
      panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => { dragging = false; header.style.cursor = 'grab'; });

    document.body.appendChild(panel);
    return panel;
  }

  /* ── Init ─────────────────────────────────────────────────────────── */
  _ui = _createUI();
  _uiLog('system', 'GimJector loaded ✓ — enter a game code and click Flood');

  window.__GimJector = {
    start:  _startFlood,
    stop:   _stopFlood,
    bots:   _bots,
    panel:  _ui,
    show:   () => { if (!document.getElementById('gimjector-panel')) { _ui = _createUI(); } },
  };

  console.info('%c GimJector v6.0 loaded ', 'background:#7c6dfa;color:#fff;font-weight:bold;border-radius:4px');
  console.info('Use window.__GimJector.start({code,count,delay}) or the panel above.');

})();
`;

writeFileSync(path.join(__dirname, 'console-script.js'), consoleScript, 'utf8');
console.log('✓ console-script.js written (' + (consoleScript.length / 1024).toFixed(1) + ' KB)');
