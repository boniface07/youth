/* eslint-disable no-undef */
import express from 'express';
import { pool } from '../server.js';
import sanitizeHtml from 'sanitize-html';
import jwt from 'jsonwebtoken';

const impactRouter = express.Router();

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
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

// GET /api/impact
impactRouter.get('/impact', async (req, res) => {
  console.log('GET /api/impact called');
  try {
    console.log('Querying stats table...');
    const [statsRows] = await pool.query(
      'SELECT id, value, label, icon, `order` FROM stats ORDER BY `order`'
    );
    console.log('Stats query successful, rows:', statsRows.length);

    console.log('Querying testimonials table...');
    const [testimonialsRows] = await pool.query(
      'SELECT id, quote, name, program, `order` FROM testimonials ORDER BY `order`'
    );
    console.log('Testimonials query successful, rows:', testimonialsRows.length);

    console.log('Fetched impact data:', {
      stats: statsRows.length,
      testimonials: testimonialsRows.length,
    });

    const sanitizedStats = statsRows.map((stat) => ({
      id: stat.id,
      value: sanitizeHtml(stat.value || '', sanitizeOptions),
      label: sanitizeHtml(stat.label || '', sanitizeOptions),
      icon: sanitizeHtml(stat.icon || 'EmojiEvents', sanitizeOptions),
    }));

    const sanitizedTestimonials = testimonialsRows.map((testimonial) => ({
      id: testimonial.id,
      quote: sanitizeHtml(testimonial.quote || '', sanitizeOptions),
      name: sanitizeHtml(testimonial.name || 'Anonymous', sanitizeOptions),
      program: sanitizeHtml(testimonial.program || 'Unknown Program', sanitizeOptions),
      avatar: null, // Explicitly set to null since column doesn't exist
    }));

    res.set('Cache-Control', 'no-store');
    res.json({ stats: sanitizedStats, testimonials: sanitizedTestimonials });
  } catch (error) {
    console.error('Error fetching impact data:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/impact
impactRouter.put('/impact', verifyToken, async (req, res) => {
  const { stats, testimonials } = req.body;

  // Validate stats
  if (
    !Array.isArray(stats) ||
    stats.some(
      (s) =>
        !s.value?.trim() ||
        !s.label?.trim() ||
        !s.icon?.trim() ||
        s.value.length > 50 ||
        s.label.length > 100 ||
        s.icon.length > 100
    )
  ) {
    console.error('Invalid stats data:', stats);
    return res.status(400).json({ error: 'Invalid stats data' });
  }

  // Validate testimonials
  if (
    !Array.isArray(testimonials) ||
    testimonials.some(
      (t) =>
        !t.quote?.trim() ||
        !t.name?.trim() ||
        !t.program?.trim() ||
        t.name.length > 100 ||
        t.program.length > 100 ||
        t.quote.length > 5000
    )
  ) {
    console.error('Invalid testimonials data:', testimonials);
    return res.status(400).json({ error: 'Invalid testimonials data' });
  }

  const sanitizedStats = stats.map((s, index) => ({
    value: sanitizeHtml(s.value, sanitizeOptions),
    label: sanitizeHtml(s.label, sanitizeOptions),
    icon: sanitizeHtml(s.icon, sanitizeOptions),
    order: index + 1,
  }));

  const sanitizedTestimonials = testimonials.map((t, index) => ({
    quote: sanitizeHtml(t.quote, sanitizeOptions),
    name: sanitizeHtml(t.name, sanitizeOptions),
    program: sanitizeHtml(t.program, sanitizeOptions),
    order: index + 1,
  }));

  try {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query('DELETE FROM stats');
      await connection.query('DELETE FROM testimonials');

      if (sanitizedStats.length > 0) {
        const statsValues = sanitizedStats.map((s) => [
          s.value,
          s.label,
          s.icon,
          s.order,
        ]);
        await connection.query(
          'INSERT INTO stats (value, label, icon, `order`) VALUES ?',
          [statsValues]
        );
      }

      if (sanitizedTestimonials.length > 0) {
        const testimonialsValues = sanitizedTestimonials.map((t) => [
          t.quote,
          t.name,
          t.program,
          t.order,
        ]);
        await connection.query(
          'INSERT INTO testimonials (quote, name, program, `order`) VALUES ?',
          [testimonialsValues]
        );
      }

      await connection.commit();
      console.log('Impact data updated successfully');
      res.json({ message: 'Impact data updated successfully' });
    } catch (error) {
      await connection.rollback();
      console.error('Error updating impact data:', error.message, error.stack);
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error updating impact data:', error.message, error.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
});
export default impactRouter;