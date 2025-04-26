/* eslint-disable no-undef */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\backend\routes\home.js
import express from 'express';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';
import path from 'path';
import { fileURLToPath } from 'url';

const homeRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Correct path to backend/images

const getBaseUrl = (req) => {
  let baseUrl;
  if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.BACKEND_URL || 'https://youth-spark-backend-production.up.railway.app';
  } else {
    baseUrl = `${req.protocol}://${req.get('host')}`;
  }
  return baseUrl.replace(/\/+$/, '');
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.error('[Home Route] No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  if (!process.env.JWT_SECRET) {
    console.error('[Home Route] JWT_SECRET is not defined');
    return res.status(500).json({ message: 'Server configuration error' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('[Home Route] Token verified for user:', decoded.username);
    next();
  } catch (error) {
    console.error('[Home Route] Token verification error:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

homeRouter.get('/home', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    const [rows] = await connection.execute('SELECT * FROM home LIMIT 1');
    const homeContent = rows[0] || {};
    console.log('[Home Route] Fetched content:', homeContent);

    let imageUrl = homeContent.image_url || `${getBaseUrl(req)}/images/default-hero.jpg`;
    // If image_url is relative (e.g., /images/xxx.jpg), prepend base URL
    if (imageUrl.startsWith('/images/')) {
      imageUrl = `${getBaseUrl(req)}${imageUrl}`;
    }

    res.json({
      title: homeContent.title || '',
      description: homeContent.description || '',
      image_url: imageUrl,
    });
  } catch (error) {
    console.error('[Home Route] Error fetching content:', error.message);
    res.status(500).json({ message: 'Failed to fetch content' });
  } finally {
    if (connection) await connection.end();
  }
});

homeRouter.put('/home', verifyToken, async (req, res) => {
  const { title, description, image_url } = req.body;
  let connection;
  try {
    if (!title || !description || !image_url) {
      console.error('[Home Route] Missing required fields');
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const cleanedTitle = sanitizeHtml(title, { allowedTags: [], allowedAttributes: {} });
    const cleanedDescription = sanitizeHtml(description, { allowedTags: [], allowedAttributes: {} });
    let cleanedImageUrl = image_url;
    // If image_url is relative, prepend base URL
    if (cleanedImageUrl.startsWith('/images/')) {
      cleanedImageUrl = `${getBaseUrl(req)}${cleanedImageUrl}`;
    }

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.execute(
      'INSERT INTO home (title, description, image_url) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE title = ?, description = ?, image_url = ?',
      [cleanedTitle, cleanedDescription, cleanedImageUrl, cleanedTitle, cleanedDescription, cleanedImageUrl]
    );

    console.log('[Home Route] Content updated:', {
      title: cleanedTitle,
      description: cleanedDescription,
      image_url: cleanedImageUrl,
    });
    res.json({ message: 'Homepage content updated successfully' });
  } catch (error) {
    console.error('[Home Route] Error updating content:', error.message);
    res.status(500).json({ message: 'Failed to update content' });
  } finally {
    if (connection) await connection.end();
  }
});

export default homeRouter;