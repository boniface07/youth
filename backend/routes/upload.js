/* eslint-disable no-undef */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\backend\routes\upload.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const uploadRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'images'); // Changed to 'images' for consistency

// Ensure images directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('[Upload Route] Created images directory:', uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('[Upload Route] Saving to directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`; // Use uuid for unique filenames
    console.log('[Upload Route] Generated filename:', filename);
    cb(null, filename);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    console.error('[Upload Route] Invalid file type:', file.mimetype);
    cb(new Error('Only JPEG/PNG images are allowed'));
  },
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.error('[Upload Route] No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  if (!process.env.JWT_SECRET) {
    console.error('[Upload Route] JWT_SECRET is not defined');
    return res.status(500).json({ message: 'Server configuration error' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('[Upload Route] Token verified for user:', decoded.username);
    next();
  } catch (error) {
    console.error('[Upload Route] Token verification error:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Get base URL
const getBaseUrl = (req) => {
  let baseUrl;
  if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.BACKEND_URL || 'https://youth-spark-backend-production.up.railway.app';
  } else {
    baseUrl = `${req.protocol}://${req.get('host')}`;
  }
  return baseUrl.replace(/\/+$/, '');
};

// POST /api/upload
uploadRouter.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  console.log('[Upload Route] File upload request received:', req.file);
  if (!req.file) {
    console.error('[Upload Route] No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const relativePath = `/images/${req.file.filename}`;
  const imageUrl = `${getBaseUrl(req)}${relativePath}`;
  console.log('[Upload Route] Image uploaded:', { relativePath, imageUrl });

  res.json({ imageUrl });
});

export default uploadRouter;