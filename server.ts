import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Active Sessions Store: sessionId -> lastActiveTimestamp (ms)
  const activeSessions = new Map<string, number>();
  const sseClients = new Set<express.Response>();

  // Cleanup stale sessions older than 12 seconds
  const cleanupAndBroadcast = () => {
    const now = Date.now();
    let changed = false;

    for (const [id, lastSeen] of activeSessions.entries()) {
      if (now - lastSeen > 12000) {
        activeSessions.delete(id);
        changed = true;
      }
    }

    if (changed) {
      broadcastCount();
    }
  };

  setInterval(cleanupAndBroadcast, 4000);

  const broadcastCount = () => {
    const count = activeSessions.size;
    const payload = `data: ${JSON.stringify({ count })}\n\n`;
    sseClients.forEach(res => res.write(payload));
  };

  // API Route: Heartbeat from client
  app.post('/api/presence/heartbeat', (req, res) => {
    const { sessionId } = req.body;
    if (sessionId) {
      const isNew = !activeSessions.has(sessionId);
      activeSessions.set(sessionId, Date.now());
      if (isNew) {
        broadcastCount();
      }
    }
    res.json({ count: activeSessions.size });
  });

  // API Route: SSE Stream for instant live count updates
  app.get('/api/presence/stream', (req, res) => {
    const sessionId = (req.query.id as string) || Math.random().toString(36).substring(2);
    activeSessions.set(sessionId, Date.now());

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });

    // Send initial count
    res.write(`data: ${JSON.stringify({ count: activeSessions.size })}\n\n`);
    sseClients.add(res);
    broadcastCount();

    req.on('close', () => {
      sseClients.delete(res);
      activeSessions.delete(sessionId);
      broadcastCount();
    });
  });

  // API Route: Get current presence count
  app.get('/api/presence/count', (_req, res) => {
    res.json({ count: activeSessions.size });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
