# GimJector

> Floods Gimkit game rooms with bots by reverse-engineering the live matchmaking protocol. Dynamically encodes session tokens via StegCloak steganography, connects over Blueboat WebSockets, and sustains each bot with heartbeats. Configurable bot count, names, and spawn speed via a real-time browser dashboard.

---

## How It Works

GimJector replicates Gimkit's official client join flow entirely in Node.js:

1. Fetches the `/join` page and extracts the session JID from a `<meta>` tag
2. Reverses and encodes the JID using **StegCloak** (AES-256-CTR + zero-width character steganography) — a unique token is generated per bot
3. Posts to Gimkit's matchmaker API to receive a server URL and intent ID
4. Opens a **Blueboat WebSocket** (Socket.IO EIO=3) per bot and sends a msgpack join packet
5. Sustains each connection with a heartbeat ping every 25 seconds

---

## Requirements

- [Node.js](https://nodejs.org) v18+
- npm

---

## Setup

```bash
git clone https://github.com/yourname/gimjector
cd gimjector
npm install
node server.js
```

Then open **http://localhost:3000** in your browser.

---

## File Structure

```
gimjector/
├── server.js          # Node.js bridge server
├── package.json
├── network/
│   └── blueboat.js    # Gimkit's original msgpack encoder
└── public/
    └── index.html     # Browser dashboard
```

---

## Usage

1. Start a Gimkit game and copy the join code
2. Open the dashboard at `http://localhost:3000`
3. Enter the game code, a name prefix, bot count, and spawn delay
4. Click **Flood** — bots will appear in the lobby in real time
5. Click **Stop** to disconnect all bots instantly

| Field | Description | Default |
|---|---|---|
| Game Code | The 6-digit Gimkit join code | — |
| Name Prefix | Bots are named `Prefix1`, `Prefix2`… | `Bot` |
| Bot Count | How many bots to spawn | `10` |
| Delay (ms) | Stagger between each spawn | `300` |

---

## Dependencies

| Package | Purpose |
|---|---|
| `express` | Serves the browser dashboard |
| `ws` | WebSocket server (browser bridge) + client (Gimkit connection) |
| `node-fetch` | HTTP requests to Gimkit's API |
| `node-html-parser` | Parses the `/join` page to extract the JID |
| `stegcloak` | Encodes the JID into the `clientType` token Gimkit validates |

---

## Disclaimer

GimJector is a proof-of-concept for educational and research purposes. Use responsibly.
