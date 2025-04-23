/* eslint-disable no-undef */
import express from 'express';
import { pool } from '../server.js';
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';

const aboutRouter = express.Router();

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expect "Bearer <token>"
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Configure sanitize-html options for rich text
const sanitizeOptions = {
  allowedTags: ['p', 'b', 'i', 'ul', 'ol', 'li', 'img'],
  allowedAttributes: {
    img: ['src', 'alt'],
  },
};

// GET /api/about - Fetch about data
aboutRouter.get('/about', async (req, res) => {
  try {
    const [aboutRows] = await pool.query('SELECT * FROM about WHERE id = 1');
    const [missionPoints] = await pool.query(
      'SELECT point FROM mission_points WHERE about_id = 1 ORDER BY `order`'
    );
    const [historyPoints] = await pool.query(
      'SELECT point FROM history_points WHERE about_id = 1 ORDER BY `order`'
    );

    const response = {
      vision: aboutRows[0]?.vision ? sanitizeHtml(aboutRows[0].vision, sanitizeOptions) : '',
      mission: aboutRows[0]?.mission ? sanitizeHtml(aboutRows[0].mission, sanitizeOptions) : '',
      missionPoints: missionPoints.map((item) => sanitizeHtml(item.point, { allowedTags: [] })),
      historyPoints: historyPoints.map((item) => sanitizeHtml(item.point, { allowedTags: [] })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching about data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/about - Update about data
aboutRouter.put('/about', verifyToken, async (req, res) => {
  const { vision, mission, missionPoints, historyPoints } = req.body;

  // Validate input
  if (
    !vision ||
    !mission ||
    !Array.isArray(missionPoints) ||
    !Array.isArray(historyPoints) ||
    vision.length > 5000 ||
    mission.length > 5000 ||
    missionPoints.some((p) => p.length > 500) ||
    historyPoints.some((p) => p.length > 500)
  ) {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const sanitizedData = {
    vision: sanitizeHtml(vision, sanitizeOptions),
    mission: sanitizeHtml(mission, sanitizeOptions),
    missionPoints: missionPoints.map((point) => sanitizeHtml(point, { allowedTags: [] })),
    historyPoints: historyPoints.map((point) => sanitizeHtml(point, { allowedTags: [] })),
  };

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const [aboutRows] = await connection.query('SELECT id FROM about WHERE id = 1');
      if (aboutRows.length === 0) {
        await connection.query('INSERT INTO about (id, vision, mission) VALUES (1, ?, ?)', [
          sanitizedData.vision,
          sanitizedData.mission,
        ]);
      } else {
        await connection.query(
          'UPDATE about SET vision = ?, mission = ?, updated_at = NOW() WHERE id = 1',
          [sanitizedData.vision, sanitizedData.mission]
        );
      }

      await connection.query('DELETE FROM mission_points WHERE about_id = 1');
      if (sanitizedData.missionPoints.length > 0) {
        const missionValues = sanitizedData.missionPoints.map((point, index) => [1, point, index + 1]);
        await connection.query(
          'INSERT INTO mission_points (about_id, point, `order`) VALUES ?',
          [missionValues]
        );
      }

      await connection.query('DELETE FROM history_points WHERE about_id = 1');
      if (sanitizedData.historyPoints.length > 0) {
        const historyValues = sanitizedData.historyPoints.map((point, index) => [1, point, index + 1]);
        await connection.query(
          'INSERT INTO history_points (about_id, point, `order`) VALUES ?',
          [historyValues]
        );
      }

      await connection.commit();
      res.json({ message: 'About data updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating about data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default aboutRouter;