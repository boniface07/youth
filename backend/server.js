/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\backend\server.js
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import homeRouter from './routes/home.js';
import uploadRouter from './routes/upload.js';
import aboutRouter from './routes/about.js';
import programsRouter from './routes/programs.js';
import impactRouter from './routes/impact.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Starting server initialization...');
console.log('Current directory:', __dirname);

// Load environment variables
if (process.env.NODE_ENV !== 'production') {
  const envPath = path.resolve(__dirname, '.env');
  const dotenvConfig = dotenv.config({ path: envPath });
  if (dotenvConfig.error) {
    console.error('Dotenv error (ignored in production):', dotenvConfig.error);
  } else {
    console.log('Environment variables loaded from .env');
  }
} else {
  console.log('Running in production, using environment variables');
}

// Check for required environment variables
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  console.error('Missing required environment variables:', {
    DB_HOST: !!process.env.DB_HOST,
    DB_USER: !!process.env.DB_USER,
    DB_PASSWORD: !!process.env.DB_PASSWORD,
    DB_NAME: !!process.env.DB_NAME,
  });
  process.exit(1);
}

// Initialize Express app
const app = express();

// Create MySQL connection pool
console.log('Creating MySQL connection pool...');
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL successfully');
    connection.release();
  } catch (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
})();

// Middleware
const allowedOrigins = [
  'https://youth-spark-frontend-production.up.railway.app',
  'https://youth-spark-frontend-production-38ef.up.railway.app',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// API Routes (must come before static file serving)
try {
  console.log('Registering auth routes...');
  app.use('/api', authRoutes);
  console.log('Registering home routes...');
  app.use('/api', homeRouter);
  console.log('Registering upload routes...');
  app.use('/api', uploadRouter);
  console.log('Registering about routes...');
  app.use('/api', aboutRouter);
  console.log('Registering programs routes...');
  app.use('/api', programsRouter);
  console.log('Registering impact routes...');
  app.use('/api', impactRouter);
} catch (err) {
  console.error('Error registering routes:', err);
  process.exit(1);
}

// Serve frontend (COMMENT OUT THIS SECTION IF FRONTEND IS HOSTED SEPARATELY)
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
console.log('Serving frontend from:', distPath);

// Catch-all route for frontend (only for non-API routes)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    console.log('Serving index.html for request:', req.url);
    res.sendFile(indexPath);
  } else {
    console.error('index.html not found at:', indexPath);
    res.status(404).json({ error: 'Frontend files not found. Ensure dist folder exists.' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Application error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('Server startup complete');

export { pool };