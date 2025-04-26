/* eslint-disable no-undef */
import express from 'express';
import { pool } from '../server.js';

const homeRouter = express.Router();

// Helper function to get base URL
const getBaseUrl = (req) => {
  if (process.env.NODE_ENV === 'production') {
    // Use production backend URL from environment variable
    return process.env.VITE_API_URL;
  }
  // Use request protocol and host for local development
  return `${req.protocol}://${req.get('host')}`;
};

// Fetch home content
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

    // Ensure image_url is a relative path and prepend base URL
    let imageUrl = homeContent.image_url;
    if (imageUrl && !imageUrl.startsWith('/images/')) {
      // If image_url is a full URL, extract the relative path (backward compatibility)
      imageUrl = imageUrl.replace(/^https?:\/\/[^/]+/, '');
      console.log('[Home Route] Converted image_url to relative:', imageUrl);
    }
    const fullImageUrl = imageUrl ? `${getBaseUrl(req)}${imageUrl}` : null;

    res.json({
      title: homeContent.title,
      description: homeContent.description,
      image_url: fullImageUrl,
    });
  } catch (err) {
    console.error('[Home Route] Database error:', {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update home content (for AdminHome.jsx)
homeRouter.put('/home', async (req, res) => {
  const { title, description, image_url } = req.body;

  console.log('[Home Route] PUT request received with body:', req.body);

  if (!title || !description || !image_url) {
    console.log('[Home Route] Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Ensure image_url is stored as a relative path
  let relativeImageUrl = image_url;
  if (relativeImageUrl.includes('://')) {
    // If a full URL is provided, extract the relative path
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
    const values = [title, description, relativeImageUrl];

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