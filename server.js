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

const clientDist = path.join(__dirname, 'client', 'dist');
const reactIndex = path.join(clientDist, 'index.html');
const serveReact = fs.existsSync(reactIndex);

const EmailService = require('./services/email');

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        connectSrc: ["'self'"]
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

app.use(cors());
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
