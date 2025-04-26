/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
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
const allowedOrigins = [process.env.FRONTEND_URL || 'http://localhost:5173'];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));
console.log('Serving static images from:', path.join(__dirname, 'public/images'));

// Serve frontend
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));
console.log('Serving frontend from:', distPath);
app.get('*', (req, res) => {
  console.log('Serving index.html for request:', req.url);
  res.sendFile(path.join(distPath, 'index.html'));
});

// Routes
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

// Error handling
app.use((err, req, res, next) => {
  console.error('Application error:', err);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('Server startup complete');

export { pool };