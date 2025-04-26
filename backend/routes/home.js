/* eslint-disable no-undef */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\backend\routes\home.js
import express from 'express';
import { pool } from '../server.js';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';

const homeRouter = express.Router();

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

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
    next();
  } catch (error) {
    console.error('[Home Route] Token verification error:', error.message);
    res.status(403).json({ message: 'Invalid token' });
  }
};

// Helper function to get base URL
const getBaseUrl = (req) => {
  let baseUrl;
  if (process.env.NODE_ENV === 'production') {
    baseUrl = process.env.BACKEND_URL || 'https://youth-spark-backend-production.up.railway.app';
  } else {
    baseUrl = `${req.protocol}://${req.get('host')}`;
  }
  return baseUrl.replace(/\/+$/, '');
};

// GET /api/home
homeRouter.get('/home', async (req, res) => {
  const query = 'SELECT title, description, image_url FROM home LIMIT 1';
  console.log('[Home Route] Executing query:', query);

  try {
    const [results] = await pool.query(query);
    console.log('[Home Route] Query results:', results);

    if (results.length === 0) {
      console.log('[Home Route] No data found in home table');
      return res.status(404).json({ message: 'No home content found' });
    }

    const homeContent = results[0];
    console.log('[Home Route] Fetched content:', homeContent);

    // Sanitize output
    const sanitizedContent = {
      title: sanitizeHtml(homeContent.title || '', sanitizeOptions),
      description: sanitizeHtml(homeContent.description || '', sanitizeOptions),
      image_url: homeContent.image_url,
    };

    // Construct full image URL
    let imageUrl = sanitizedContent.image_url;
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `${getBaseUrl(req)}${imageUrl}`;
      console.log('[Home Route] Constructed full image_url:', imageUrl);
    }

    res.json({
      title: sanitizedContent.title,
      description: sanitizedContent.description,
      image_url: imageUrl || null,
    });
  } catch (err) {
    console.error('[Home Route] Database error:', {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/home
homeRouter.put('/home', verifyToken, async (req, res) => {
  const { title, description, image_url } = req.body;
  console.log('[Home Route] PUT request received with body:', req.body);

  // Validate inputs
  if (!title?.trim() || !description?.trim() || !image_url?.trim()) {
    console.log('[Home Route] Missing required fields');
    return res.status(400).json({ message: 'Title, description, and image_url are required' });
  }
  if (title.length > 100) {
    console.log('[Home Route] Title too long:', title.length);
    return res.status(400).json({ message: 'Title must be 100 characters or less' });
  }
  if (description.length > 1000) {
    console.log('[Home Route] Description too long:', description.length);
    return res.status(400).json({ message: 'Description must be 1000 characters or less' });
  }

  // Sanitize inputs
  const sanitizedTitle = sanitizeHtml(title, sanitizeOptions);
  const sanitizedDescription = sanitizeHtml(description, sanitizeOptions);
  let relativeImageUrl = image_url;

  // Ensure image_url is a relative path
  if (relativeImageUrl.includes('://')) {
    relativeImageUrl = relativeImageUrl.replace(/^https?:\/\/[^/]+/, '');
    console.log('[Home Route] Converted image_url to relative:', relativeImageUrl);
  }
  if (!relativeImageUrl.startsWith('/images/')) {
    console.log('[Home Route] Invalid image_url format');
    return res.status(400).json({ message: 'image_url must be a relative path starting with /images/' });
  }

  const checkQuery = 'SELECT id FROM home LIMIT 1';
  console.log('[Home Route] Checking for existing data:', checkQuery);

  try {
    const [checkResults] = await pool.query(checkQuery);
    console.log('[Home Route] Check query results:', checkResults);

    const query =
      checkResults.length > 0
        ? 'UPDATE home SET title = ?, description = ?, image_url = ? WHERE id = 1'
        : 'INSERT INTO home (title, description, image_url) VALUES (?, ?, ?)';
    const values = [sanitizedTitle, sanitizedDescription, relativeImageUrl];

    console.log('[Home Route] Executing query:', query, 'with values:', values);

    await pool.query(query, values);
    console.log('[Home Route] Home content updated successfully');

    res.json({ message: 'Home content updated successfully' });
  } catch (err) {
    console.error('[Home Route] Database error:', {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default homeRouter;