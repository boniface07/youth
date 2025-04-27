/* eslint-disable no-undef */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\backend\routes\home.js
import express from 'express';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';

const homeRouter = express.Router();

// JWT verification middleware
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

// GET /api/home
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

    const imageUrl = homeContent.image_url || 'https://res.cloudinary.com/your-cloud-name/image/upload/v1/youth_spark/default-hero.jpg';

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

// PUT /api/home
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
    const cleanedImageUrl = image_url;

    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    // Check if a record exists
    const [rows] = await connection.execute('SELECT id FROM home LIMIT 1');
    if (rows.length === 0) {
      console.error('[Home Route] No homepage content found to update');
      return res.status(404).json({ message: 'No homepage content found to update' });
    }

    // Update the existing record
    await connection.execute(
      'UPDATE home SET title = ?, description = ?, image_url = ? WHERE id = ?',
      [cleanedTitle, cleanedDescription, cleanedImageUrl, rows[0].id]
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