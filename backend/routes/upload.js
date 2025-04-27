/* eslint-disable no-undef */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\backend\routes\upload.js
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const uploadRouter = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer configuration (store in memory, not disk)
const upload = multer({
  storage: multer.memoryStorage(),
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

// POST /api/upload
uploadRouter.post('/upload', verifyToken, upload.single('image'), async (req, res) => {
  console.log('[Upload Route] File upload request received:', req.file);
  if (!req.file) {
    console.error('[Upload Route] No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    // Generate a unique filename
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `images/${uuidv4()}${ext}`;

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { public_id: filename, folder: 'youth_spark' },
      (error, result) => {
        if (error) {
          console.error('[Upload Route] Cloudinary upload error:', error);
          return res.status(500).json({ message: 'Failed to upload image' });
        }
        const imageUrl = result.secure_url;
        console.log('[Upload Route] Image uploaded to Cloudinary:', imageUrl);
        res.json({ imageUrl });
      }
    );
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('[Upload Route] Upload error:', error.message);
    return res.status(500).json({ message: 'Failed to upload image' });
  }
});

export default uploadRouter;