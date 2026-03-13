# GimJector

> Floods Gimkit game rooms with bots by reverse-engineering the live matchmaking protocol. Encodes session tokens via StegCloak steganography, connects over Blueboat WebSockets, and sustains each bot with heartbeats.

Two ways to use GimJector:

| Mode | How | Requires |
|---|---|---|
| **Console Script** ✨ | Paste `console-script.js` into your browser console while on any `gimkit.com` page | Nothing — runs entirely in the browser |
| **Bridge Server** | Run `node server.js` and open the dashboard at `localhost:3000` | Node.js v18+ on your machine |

---

## Quick Start — Console Script (no VPS needed)

1. Open any [Gimkit](https://www.gimkit.com) page in your browser (e.g. the `/join` page or a live game)
2. Open **DevTools** → **Console** (F12 or Cmd+Option+I)
3. Copy the entire contents of [`console-script.js`](./console-script.js)
4. Paste and press **Enter**

A floating **GimJector panel** will appear in the top-right corner of the page.

### Panel controls

| Field | Description | Default |
|---|---|---|
| Game Code | The Gimkit join code | — |
| Random names | Toggle to generate random bot names | off |
| Name Prefix | Bots are named `Prefix1`, `Prefix2`… | `Bot` |
| Bot Count | Number of bots to spawn | `10` |
| Delay (ms) | Stagger between spawns | `300` |
| Auto-reconnect | Automatically reconnect dropped bots | off |
| Chat Spam | Optionally have bots spam chat | — |

Click **🚀 Flood** to start, **⛔ Stop** to disconnect all bots.

### Console API

The script also exposes `window.__GimJector` for scripted control:

```js
// Start with options
await window.__GimJector.start({
  code: '123456',     // game join code
  count: 20,          // number of bots
  delay: 250,         // ms between spawns
  namePrefix: 'Bot',  // name prefix (ignored when randomNames=true)
  randomNames: true,  // random adjective+noun names
  autoReconnect: true,
  spamMessage: 'hi',  // optional chat spam
  spamInterval: 3000, // ms between spam messages
});

// Stop all bots
window.__GimJector.stop();

// Inspect active bots
console.log(window.__GimJector.bots);
```

---

## Bridge Server (alternative)

The original Node.js server approach is still available for those who prefer it.

### Requirements

- [Node.js](https://nodejs.org) v18+

### Setup

```bash
git clone https://github.com/yourname/gimjector
cd gimjector
npm install
node server.js
```

Open **http://localhost:3000** in your browser.

---

## How It Works

GimJector replicates Gimkit's official client join flow:

1. Fetches `/join` and extracts the session JID from a `<meta>` tag
2. Encodes the JID using **StegCloak** (AES-256-CTR + zero-width character steganography) — a unique `clientType` token is generated per bot via a random AES salt
3. Posts to `/api/matchmaker/join` to receive a server URL and intent ID
4. Opens a **Blueboat WebSocket** (Socket.IO EIO=3) per bot and sends a msgpack join packet
5. Sustains each connection with a heartbeat ping every 25 seconds

In the console script, steps 1–5 run entirely inside the browser using:
- **`fetch`** for HTTP (same-origin, no CORS issues)
- **`WebSocket`** (native browser API)
- **`crypto.subtle`** for AES-256-CTR and PBKDF2 key derivation
- **`lzutf8`** (browser build, bundled inline) for the StegCloak compression step

---

## Building the Console Script

The console script is pre-built and committed as `console-script.js`. To rebuild it after making changes to the source:

```bash
npm run build:console
```

This runs `build-console.js`, which inlines the lzutf8 browser build and the blueboat encoder into a single self-contained script.

---

## File Structure

```
gimjector/
├── console-script.js   # ✨ Self-contained browser console script
├── build-console.js    # Build script that generates console-script.js
├── server.js           # Node.js bridge server (alternative usage)
├── package.json
├── network/
│   └── blueboat.js     # Gimkit's msgpack encoder
└── public/
    └── index.html      # Browser dashboard (for bridge server mode)
```

---

## Dependencies

| Package | Purpose |
|---|---|
| `express` | Serves the browser dashboard (bridge server mode) |
| `ws` | WebSocket client for Gimkit connection (bridge server mode) |
| `node-fetch` | HTTP requests to Gimkit's API (bridge server mode) |
| `node-html-parser` | Parses the `/join` page to extract the JID (bridge server mode) |
| `stegcloak` | Encodes the JID into the `clientType` token Gimkit validates |
| `lzutf8` | LZ-UTF8 compression (used by StegCloak, inlined in console script) |

---

## Disclaimer

GimJector is a proof-of-concept for educational and research purposes. Use responsibly.
