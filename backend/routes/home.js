import express from 'express';
import { pool } from '../server.js';

const homeRouter = express.Router();

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

    res.json({
      title: homeContent.title,
      description: homeContent.description,
      image_url: homeContent.image_url,
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

  const checkQuery = 'SELECT id FROM home LIMIT 1';
  console.log('[Home Route] Checking for existing data:', checkQuery);

  try {
    const [checkResults] = await pool.query(checkQuery);

    console.log('[Home Route] Check query results:', checkResults);

    const query =
      checkResults.length > 0
        ? 'UPDATE home SET title = ?, description = ?, image_url = ? WHERE id = 1'
        : 'INSERT INTO home (title, description, image_url) VALUES (?, ?, ?)';
    const values = [title, description, image_url];

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