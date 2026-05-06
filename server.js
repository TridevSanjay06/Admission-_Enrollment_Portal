const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// ── Startup env diagnostics (masks sensitive values) ──────────────
console.log('[env] SMTP_HOST         :', process.env.SMTP_HOST          || '❌ NOT SET');
console.log('[env] SMTP_PORT         :', process.env.SMTP_PORT          || '❌ NOT SET');
console.log('[env] SMTP_USER         :', process.env.SMTP_USER          || '❌ NOT SET');
console.log('[env] SMTP_PASS         :', process.env.SMTP_PASS          ? '✅ SET (hidden)' : '❌ NOT SET');
console.log('[env] SCHOOL_FROM_EMAIL :', process.env.SCHOOL_FROM_EMAIL  || '❌ NOT SET');
// ──────────────────────────────────────────────────────────────────

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const clientDist = path.join(__dirname, 'client', 'dist');
const reactIndex = path.join(clientDist, 'index.html');
const serveReact = fs.existsSync(reactIndex);

const EmailService = require('./services/email');

// ── CORS ──────────────────────────────────────────────────────────
// In production, only allow origins listed in ALLOWED_ORIGINS (comma-separated).
// In development, allow localhost on common ports as a convenience fallback.
const buildAllowedOrigins = () => {
  const raw = (process.env.ALLOWED_ORIGINS || '').trim();
  if (raw) {
    return raw.split(',').map((o) => o.trim()).filter(Boolean);
  }
  if (NODE_ENV !== 'production') {
    return [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
  }
  return [];
};

const allowedOrigins = buildAllowedOrigins();
console.log('[cors] Allowed origins:', allowedOrigins.length ? allowedOrigins : '(none — same-origin only)');

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (e.g. mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS policy: origin '${origin}' is not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
// ──────────────────────────────────────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'", ...allowedOrigins]
      }
    }
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use('/Styles', express.static(path.join(__dirname, 'Styles')));

console.log(
  '[email] Ready:',
  EmailService.isConfigured() ? `yes (host=${process.env.SMTP_HOST})` : 'no — check env'
);

app.use('/api/enroll', require('./routes/enroll'));
app.use('/api/chatbot', require('./routes/chatbot'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    frontend: serveReact ? 'react' : 'legacy-html',
    email: {
      configured: EmailService.isConfigured(),
      provider: EmailService.provider
    }
  });
});

if (serveReact) {
  app.use(express.static(clientDist));
}

if (!serveReact) {
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
  });
  app.get('/main', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
  });
  app.get('/enroll', (req, res) => {
    res.sendFile(path.join(__dirname, 'enroll.html'));
  });
  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
  });
}

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Route not found' });
  }
  if (serveReact && (req.method === 'GET' || req.method === 'HEAD')) {
    return res.sendFile(reactIndex);
  }
  return res.status(404).json({ error: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

const server = app.listen(PORT, () => {
  console.log(`AMS Admission System on port ${PORT}`);
  console.log(`SQLite: ams.db`);
  console.log(serveReact ? 'Frontend: React (client/dist)' : 'Frontend: legacy HTML');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`[server] Port ${PORT} is already in use. Kill the other process first, then restart.`);
    process.exit(1);
  } else {
    throw err;
  }
});
