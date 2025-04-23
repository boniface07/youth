/* eslint-disable no-undef */
import express from 'express';
import { pool } from '../server.js';
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';
import striptags from 'striptags';

const programsRouter = express.Router();

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(403).json({ error: 'Invalid token' });
  }
};

// GET /api/programs
programsRouter.get('/programs', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, title, description, icon FROM programs ORDER BY `order`'
    );

    const sanitizedPrograms = rows.map((program) => {
      // Ensure description is plain text
      const plainDescription = typeof program.description === 'string'
        ? striptags(program.description)
        : '';
      console.log('GET: Original description:', program.description, 'Stripped:', plainDescription);

      return {
        id: program.id,
        title: sanitizeHtml(program.title, sanitizeOptions),
        description: plainDescription,
        icon: sanitizeHtml(program.icon, sanitizeOptions),
      };
    });

    res.json(sanitizedPrograms);
  } catch (error) {
    console.error('Error fetching programs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/programs
programsRouter.put('/programs', verifyToken, async (req, res) => {
  const programs = req.body;

  // Validate input
  if (!Array.isArray(programs) || programs.some(p =>
    !p.title ||
    !p.description ||
    !p.icon ||
    p.title.length > 255 ||
    (typeof p.description === 'string' && striptags(p.description).length > 5000)
  )) {
    console.error('Invalid input data:', programs);
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const sanitizedPrograms = programs.map((p, index) => {
    // Strip HTML from description
    const plainDescription = typeof p.description === 'string'
      ? striptags(p.description)
      : '';
    console.log('PUT: Original description:', p.description, 'Stripped:', plainDescription);

    return {
      id: p.id ? parseInt(p.id) : null,
      title: sanitizeHtml(p.title, sanitizeOptions),
      description: plainDescription,
      icon: sanitizeHtml(p.icon, sanitizeOptions),
      order: index + 1,
    };
  });

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Clear existing programs
      await connection.query('DELETE FROM programs');

      // Insert new programs
      if (sanitizedPrograms.length > 0) {
        const values = sanitizedPrograms.map(p => [
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
      res.json({ message: 'Programs updated successfully' });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating programs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default programsRouter;