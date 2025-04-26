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

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Configure sanitize-html options for rich text
const sanitizeOptions = {
  allowedTags: ['p', 'b', 'i', 'ul', 'ol', 'li', 'img'],
  allowedAttributes: {
    img: ['src', 'alt'],
  },
  allowedSchemes: ['https'],
};

// Initialize database schema
const initializeSchema = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS about (
        id INT PRIMARY KEY,
        vision TEXT,
        mission TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS mission_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        about_id INT,
        point VARCHAR(500),
        \`order\` INT,
        FOREIGN KEY (about_id) REFERENCES about(id)
      );
      CREATE TABLE IF NOT EXISTS history_points (
        id INT AUTO_INCREMENT PRIMARY KEY,
        about_id INT,
        point VARCHAR(500),
        \`order\` INT,
        FOREIGN KEY (about_id) REFERENCES about(id)
      );
    `);
    console.log('Database schema initialized');

    // Insert default data if table is empty
    const [aboutRows] = await pool.query('SELECT id FROM about WHERE id = 1');
    if (aboutRows.length === 0) {
      await pool.query(
        'INSERT INTO about (id, vision, mission) VALUES (1, ?, ?)',
        ['<p>Empowering youth through innovation</p>', '<p>Building a brighter future</p>']
      );
      await pool.query(
        'INSERT INTO mission_points (about_id, point, `order`) VALUES (?, ?, ?), (?, ?, ?)',
        [1, 'Foster creativity', 1, 1, 'Support education', 2]
      );
      await pool.query(
        'INSERT INTO history_points (about_id, point, `order`) VALUES (?, ?, ?), (?, ?, ?)',
        [1, 'Founded in 2020', 1, 1, 'Launched first program in 2021', 2]
      );
      console.log('Default about data inserted');
    }
  } catch (error) {
    console.error('Error initializing schema:', error);
    throw error;
  }
};

// Run schema initialization on startup
initializeSchema().catch((err) => {
  console.error('Failed to initialize database schema:', err);
  process.exit(1);
});

// GET /api/about - Fetch about data
aboutRouter.get('/about', async (req, res) => {
  console.log('GET /api/about called');
  try {
    const [aboutRows] = await pool.query('SELECT * FROM about WHERE id = 1');
    const [missionPoints] = await pool.query(
      'SELECT point FROM mission_points WHERE about_id = 1 ORDER BY `order`'
    );
    const [historyPoints] = await pool.query(
      'SELECT point FROM history_points WHERE about_id = 1 ORDER BY `order`'
    );
    console.log('Fetched data:', {
      aboutRows: aboutRows[0] || 'No about data',
      missionPoints: missionPoints.length,
      historyPoints: historyPoints.length,
    });

    const response = {
      vision: aboutRows[0]?.vision ? sanitizeHtml(aboutRows[0].vision, sanitizeOptions) : '',
      mission: aboutRows[0]?.mission ? sanitizeHtml(aboutRows[0].mission, sanitizeOptions) : '',
      missionPoints: missionPoints.map((item) => sanitizeHtml(item.point, { allowedTags: [] })),
      historyPoints: historyPoints.map((item) => sanitizeHtml(item.point, { allowedTags: [] })),
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching about data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/about - Update about data
aboutRouter.put('/about', verifyToken, async (req, res) => {
  const { vision, mission, missionPoints, historyPoints } = req.body;

  // Validate input
  if (
    !vision?.trim() ||
    !mission?.trim() ||
    !Array.isArray(missionPoints) ||
    !Array.isArray(historyPoints) ||
    vision.length > 5000 ||
    mission.length > 5000 ||
    missionPoints.some((p) => !p?.trim() || p.length > 500) ||
    historyPoints.some((p) => !p?.trim() || p.length > 500)
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
      await connection.query(
        'INSERT INTO about (id, vision, mission) VALUES (1, ?, ?) ' +
        'ON DUPLICATE KEY UPDATE vision = ?, mission = ?, updated_at = NOW()',
        [sanitizedData.vision, sanitizedData.mission, sanitizedData.vision, sanitizedData.mission]
      );

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
        const historyValues = sanitizedData.missionPoints.map((point, index) => [1, point, index + 1]);
        await connection.query(
          'INSERT INTO history_points (about_id, point, `order`) VALUES ?',
          [historyValues]
        );
      }

      await connection.commit();
      console.log('About data updated successfully');
      res.json({ message: 'About data updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating about data:', error.message);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating about data:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default aboutRouter;