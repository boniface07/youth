/* eslint-disable no-undef */
// D:\Exercise\JAVASCRIPT\REACT PROJECT\YOUTH_SPARK\youth_spark_app\backend\routes\auth.js
import express from 'express';
import { pool } from '../server.js';
import jwt from 'jsonwebtoken';
import sanitizeHtml from 'sanitize-html';

const authRouter = express.Router();

const sanitizeOptions = {
  allowedTags: [],
  allowedAttributes: {},
};

// POST /api/login
authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username?.trim() || !password?.trim()) {
    console.error('Login attempt with missing credentials:', { username });
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Sanitize inputs
  const sanitizedUsername = sanitizeHtml(username, sanitizeOptions);
  if (sanitizedUsername !== username) {
    console.error('Invalid characters in username:', username);
    return res.status(400).json({ message: 'Invalid username format' });
  }

  console.log('Login attempt for user:', sanitizedUsername);

  try {
    // Fetch user
    const [results] = await pool.query(
      'SELECT id, username, email, password, role FROM users WHERE username = ?',
      [sanitizedUsername]
    );

    if (results.length === 0) {
      console.log('No user found for username:', sanitizedUsername);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];

    // Verify password using SHA2-256
    const [passwordCheck] = await pool.query(
      'SELECT SHA2(?, 256) AS hashed_password',
      [password]
    );
    if (passwordCheck[0].hashed_password !== user.password) {
      console.log('Password mismatch for username:', sanitizedUsername);
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful for user:', sanitizedUsername);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('Login error:', err.message, err.stack);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default authRouter;