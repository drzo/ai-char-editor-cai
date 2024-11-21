import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { HttpsProxyAgent } from 'https-proxy-agent';

const app = express();
const PORT = 3001;
const CHARACTER_AI_BASE = 'https://beta.character.ai';

// Enable CORS
app.use(cors({ 
  origin: 'http://localhost:5173',
  credentials: true
}));

// Configure proxy options
const proxyOptions = {
  target: CHARACTER_AI_BASE,
  changeOrigin: true,
  secure: false,
  ws: true,
  xfwd: false,
  followRedirects: true,
  timeout: 30000,
  proxyTimeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Origin': CHARACTER_AI_BASE,
    'Referer': `${CHARACTER_AI_BASE}/`,
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Connection': 'keep-alive'
  },
  pathRewrite: {
    '^/api': ''
  },
  onProxyReq: (proxyReq, req, res) => {
    // Log outgoing request
    console.log('Sending Request:', req.method, req.url);

    // Handle POST requests
    if (req.method === 'POST' && req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log response
    console.log('Received Response:', proxyRes.statusCode, req.url);

    // Remove problematic headers
    delete proxyRes.headers['set-cookie'];
    delete proxyRes.headers['content-security-policy'];
    delete proxyRes.headers['x-frame-options'];
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.writeHead(500, {
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({
      error: 'Proxy Error',
      message: err.message || 'Failed to connect to Character.AI'
    }));
  }
};

// Create proxy middleware instances
const apiProxy = createProxyMiddleware({
  ...proxyOptions,
  agent: new HttpsProxyAgent('http://localhost:3001')
});

const avatarProxy = createProxyMiddleware({
  ...proxyOptions,
  pathRewrite: {
    '^/api/uploads': '/uploads'
  }
});

// Use proxy middleware
app.use('/api/uploads', avatarProxy);
app.use('/api', apiProxy);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: err.message || 'An unexpected error occurred'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});