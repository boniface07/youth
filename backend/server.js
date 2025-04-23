/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2/promise'; // Switch to mysql2/promise
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



// Get the directory name for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Debug .env file existence
const envPath = path.resolve(__dirname, '.env');

// Load environment variables
const dotenvConfig = dotenv.config({ path: envPath });
if (dotenvConfig.error) {
  console.error('Dotenv error:', dotenvConfig.error);
  throw new Error('Failed to load .env file');
}

// Check for required environment variables
if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_NAME) {
  throw new Error('Missing required environment variables. Please check your .env file.');
}

const app = express();

// Create MySQL connection pool
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
    console.log('Connected to MySQL');
    connection.release();
  } catch (err) {
    console.error('MySQL connection error:', err);
    process.exit(1);
  }
})();

// Middleware
app.use(cors({ origin: 'http://localhost:5173' })); // Allow frontend
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Routes
app.use('/api', authRoutes);
app.use('/api', homeRouter);
app.use('/api', uploadRouter);
app.use('/api', aboutRouter);
app.use('/api', programsRouter);
app.use('/api', impactRouter);


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export pool for use in routes
export { pool };