const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types for different file extensions
const MIME_TYPES = {
  '.html': 'text/html',
  '.css':  'text/css',
  '.js':   'text/javascript',
  '.json': 'application/json',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.woff2':'font/woff2',
};

// Simple in-memory store for messages (API)
const messages = [
  { id: 1, text: "Welcome to Nova Dashboard!", time: new Date().toISOString() }
];

// ─── Helper: serve static files ───────────────────────────────────────────
function serveStatic(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 – Not Found</h1>');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

// ─── Helper: parse JSON body ───────────────────────────────────────────────
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try { resolve(JSON.parse(body || '{}')); }
      catch (e) { reject(e); }
    });
  });
}

// ─── REST API handlers ─────────────────────────────────────────────────────
function handleAPI(req, res, pathname) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // GET /api/messages
  if (req.method === 'GET' && pathname === '/api/messages') {
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: messages }));
    return;
  }

  // POST /api/messages
  if (req.method === 'POST' && pathname === '/api/messages') {
    readBody(req).then(body => {
      if (!body.text || !body.text.trim()) {
        res.writeHead(400);
        res.end(JSON.stringify({ success: false, error: 'Text is required' }));
        return;
      }
      const newMsg = { id: Date.now(), text: body.text.trim(), time: new Date().toISOString() };
      messages.push(newMsg);
      res.writeHead(201);
      res.end(JSON.stringify({ success: true, data: newMsg }));
    }).catch(() => {
      res.writeHead(400);
      res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
    });
    return;
  }

  // DELETE /api/messages/:id
  if (req.method === 'DELETE' && pathname.startsWith('/api/messages/')) {
    const id = parseInt(pathname.split('/').pop());
    const index = messages.findIndex(m => m.id === id);
    if (index === -1) {
      res.writeHead(404);
      res.end(JSON.stringify({ success: false, error: 'Message not found' }));
      return;
    }
    messages.splice(index, 1);
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, message: 'Deleted' }));
    return;
  }

  // GET /api/stats
  if (req.method === 'GET' && pathname === '/api/stats') {
    const stats = {
      totalMessages: messages.length,
      serverTime: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsage: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      }
    };
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, data: stats }));
    return;
  }

  // 404 for unknown API routes
  res.writeHead(404);
  res.end(JSON.stringify({ success: false, error: 'API route not found' }));
}

// ─── Main request handler ──────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname  = parsedUrl.pathname;

  // Handle OPTIONS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  // Route: API
  if (pathname.startsWith('/api/')) {
    handleAPI(req, res, pathname);
    return;
  }

  // Route: static files from /public
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);

  // Security: prevent directory traversal
  const publicDir = path.resolve(__dirname, 'public');
  if (!path.resolve(filePath).startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  serveStatic(res, filePath);
});

server.listen(PORT, () => {
  console.log(`\n  ╔══════════════════════════════════════╗`);
  console.log(`  ║   🚀  NOVA DASHBOARD SERVER           ║`);
  console.log(`  ║   Running at http://localhost:${PORT}    ║`);
  console.log(`  ║   Node.js ${process.version}                  ║`);
  console.log(`  ╚══════════════════════════════════════╝\n`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌  Port ${PORT} is already in use. Try a different port.`);
  } else {
    console.error('Server error:', err);
  }
  process.exit(1);
});
