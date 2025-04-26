/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { rateLimit } from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { xss } from 'express-xss-sanitizer';
import compression from 'compression';
import sqlstring from 'sqlstring';

// Initialize app
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

// ======================
// MySQL-SPECIFIC SECURITY
// ======================

// 1. SQL Injection Protection
// (Using mysql2's built-in parameterized queries + sqlstring for manual queries)
app.use((req, res, next) => {
  // Attach SQL escape function to all requests
  req.sql = sqlstring;
  next();
});

// 2. XSS Protection
app.use(xss());

// 3. Rate Limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  skip: req => req.ip === '::1' // Skip for localhost
}));

// 4. Secure Headers (No Helmet)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// ==============
// REACT 19 CONFIG
// ==============
const allowedOrigins = [
  process.env.VITE_FRONTEND_URL,
  'http://localhost:3000', // React 19 default
  'http://localhost:5173'  // Vite default
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
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
  namedPlaceholders: true, // Important for security
  typeCast: (field, next) => {
    if (field.type === 'TINY' && field.length === 1) {
      return field.string() === '1'; // Convert TINY(1) to boolean
    }
    return next();
  }
});

// =============
// ROUTES & SERVER
// =============
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());
app.use(cookieParser());

// Example secure MySQL query route
app.post('/api/data', async (req, res) => {
  try {
    // SAFE: Using parameterized queries
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ? AND status = ?',
      [req.body.id, 'active']
    );
    res.json(rows);
  } catch (err) {
    console.error('MySQL error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
  🚀 MySQL-Secure Server running on port ${PORT}
  ⚛️  Optimized for React 19
  🔒 MySQL-Specific Protections:
     - Parameterized Queries
     - XSS Filtering
     - Rate Limiting
     - Secure Headers
  `);
});

export { pool };