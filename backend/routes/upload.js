import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const uploadRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '..', 'public', 'images');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('[Upload Route] Saving to directory:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPEG/PNG images are allowed'));
  },
});

uploadRouter.post('/upload', upload.single('image'), (req, res) => {
  console.log('[Upload Route] Received file:', req.file);
  if (!req.file) {
    console.error('[Upload Route] No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const imageUrl = `/images/${req.file.filename}`; // Use relative path
  console.log('[Upload Route] Image saved, returning:', imageUrl);
  res.json({ imageUrl });
});

export default uploadRouter;