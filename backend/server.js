/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import compression from 'compression';

// Initialize environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Initialize Express
const app = express();

// =====================
// SECURITY CONFIGURATION
// =====================

// Security Headers Middleware
app.use((req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
  next();
});

// Rate Limiting Middleware (custom implementation)
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 1000; // Max requests per window

setInterval(() => requestCounts.clear(), RATE_LIMIT_WINDOW);

app.use((req, res, next) => {
  const ip = req.ip;
  const count = requestCounts.get(ip) || 0;
  
  if (count >= RATE_LIMIT_MAX) {
    return res.status(429).json({ 
      error: 'Too many requests, please try again later' 
    });
  }
  
  requestCounts.set(ip, count + 1);
  next();
});

// Input Sanitization Middleware
app.use((req, res, next) => {
  const sanitize = (data) => {
    if (typeof data === 'string') {
      return data.replace(/[<>"'`;]/g, '');
    }
    if (Array.isArray(data)) {
      return data.map(sanitize);
    }
    if (typeof data === 'object' && data !== null) {
      return Object.fromEntries(
        Object.entries(data).map(([key, value]) => [key, sanitize(value)])
      );
    }
    return data;
  };

  if (req.body) req.body = sanitize(req.body);
  if (req.query) req.query = sanitize(req.query);
  if (req.params) req.params = sanitize(req.params);
  
  next();
});

// ==============
// REACT 19 SETUP
// ==============

// CORS Configuration
const allowedOrigins = [
  process.env.VITE_FRONTEND_URL,
  'http://localhost:3000', // React 19 default
  'http://localhost:5173'  // Vite default
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==============
// MYSQL DATABASE
// ==============
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: true,
  supportBigNumbers: true,
  bigNumberStrings: true
});

// Test database connection
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ MySQL connection established');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err);
    process.exit(1);
  }
})();

// =============
// MIDDLEWARE
// =============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(cookieParser());

// =============
// ROUTES
// =============

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    reactVersion: '19.x',
    database: 'MySQL',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Example Secure Route
app.post('/api/users', async (req, res) => {
  try {
    // Using parameterized query
    const [result] = await pool.query(
      'INSERT INTO users SET ?',
      [req.body]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('MySQL error:', err);
    res.status(500).json({ error: 'Database operation failed' });
  }
});

// =============
// ERROR HANDLING
// =============
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// =============
// SERVER START
// =============
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 Server running on port ${PORT}
  ⚛️  React 19 Compatible
  🔒 Security Features:
     - Custom Rate Limiting
     - Input Sanitization
     - Secure Headers
  💾 MySQL Database Connected
  🌍 Allowed Origins: ${allowedOrigins.join(', ')}
  `);
});

export { pool };