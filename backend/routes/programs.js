/* eslint-disable no-undef */
import express from 'express';
import { pool } from '../server.js';
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';

const programsRouter = express.Router();

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

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

// GET /api/programs
programsRouter.get('/programs', async (req, res) => {
  console.log('GET /api/programs called');
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, icon FROM programs ORDER BY `order`'
    );
    console.log('Fetched programs:', rows.length);

    const sanitizedPrograms = rows.map((program) => ({
      id: program.id,
      title: sanitizeHtml(program.title || '', sanitizeOptions),
      description: sanitizeHtml(program.description || '', sanitizeOptions),
      icon: sanitizeHtml(program.icon || 'School', sanitizeOptions),
    }));

    res.json(sanitizedPrograms);
  } catch (error) {
    console.error('Error fetching programs:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/programs
programsRouter.put('/programs', verifyToken, async (req, res) => {
  const programs = req.body;

  // Validate input
  if (
    !Array.isArray(programs) ||
    programs.some(
      (p) =>
        !p.title?.trim() ||
        !p.description?.trim() ||
        !p.icon?.trim() ||
        p.title.length > 255 ||
        p.description.length > 5000
    )
  ) {
    console.error('Invalid input data:', programs);
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const sanitizedPrograms = programs.map((p, index) => ({
    title: sanitizeHtml(p.title, sanitizeOptions),
    description: sanitizeHtml(p.description, sanitizeOptions),
    icon: sanitizeHtml(p.icon, sanitizeOptions),
    order: index + 1,
  }));

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Clear existing programs
      await connection.query('DELETE FROM programs');

      // Insert new programs
      if (sanitizedPrograms.length > 0) {
        const values = sanitizedPrograms.map((p) => [
          p.title,
          p.description,
          p.icon,
          p.order,
        ]);
        await connection.query(
          'INSERT INTO programs (title, description, icon, `order`) VALUES ?',
          [values]
        );
      }

      await connection.commit();
      console.log('Programs updated successfully');
      res.json({ message: 'Programs updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating programs:', error.message);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating programs:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default programsRouter;