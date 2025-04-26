/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { xss } from 'express-xss-sanitizer';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import homeRouter from './routes/home.js';
import uploadRouter from './routes/upload.js';
import aboutRouter from './routes/about.js';
import programsRouter from './routes/programs.js';
import impactRouter from './routes/impact.js';

// Initialize environment configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('Server initialization started...');

// Environment configuration
const envPath = path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '.env.production' : '.env');
const dotenvConfig = dotenv.config({ path: envPath });

if (dotenvConfig.error && process.env.NODE_ENV !== 'production') {
  console.warn('Warning: Could not load .env file:', dotenvConfig.error);
}

// Validate essential environment variables
const requiredEnvVars = [
  'DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME',
  'PORT', 'JWT_SECRET', 'VITE_FRONTEND_URL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('Missing required environment variables:', missingVars);
  process.exit(1);
}

// Initialize Express application
const app = express();

// Security Middleware (replacing helmet with specific protections)
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(xss());
app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS Configuration
const allowedOrigins = [
  process.env.VITE_FRONTEND_URL,
  'https://youth-spark-frontend-production-38ef.up.railway.app',
  'http://localhost:5173', // for local development
  'http://localhost:3000'  // React 19 default port
].filter(Boolean); // Remove any undefined values

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS policy'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight for all routes

// Database Connection Pool
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
};

console.log('Creating MySQL connection pool with config:', {
  ...poolConfig,
  password: '***' // Don't log actual password
});

const pool = mysql.createPool(poolConfig);

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connection established successfully');
    connection.release();
  } catch (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }
})();

// Static Files and Frontend Serving
app.use('/images', express.static(path.join(__dirname, 'public/images')));
console.log(`Serving static files from: ${path.join(__dirname, 'public/images')}`);

if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  console.log(`Serving production frontend from: ${distPath}`);

  // Catch-all for frontend routes (must come after API routes)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// API Routes
const apiRoutes = [
  { path: '/auth', router: authRoutes },
  { path: '/home', router: homeRouter },
  { path: '/upload', router: uploadRouter },
  { path: '/about', router: aboutRouter },
  { path: '/programs', router: programsRouter },
  { path: '/impact', router: impactRouter }
];

apiRoutes.forEach(({ path: routePath, router }) => {
  app.use(`/api${routePath}`, router);
  console.log(`Registered route: /api${routePath}`);
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('⚠️ Application error:', err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Something went wrong!' : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Server Startup
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  🔗 Base URL: http://localhost:${PORT}
  🌍 Allowed Origins: ${allowedOrigins.join(', ')}
  🛡️ Security: XSS, Mongo Sanitize, Rate Limiting enabled
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

export { pool };