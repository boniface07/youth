/* eslint-disable no-undef */
import express from 'express';
import { pool } from '../server.js';
import jwt from 'jsonwebtoken';

const authRouter = express.Router();

authRouter.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const [results] = await pool.query(
      'SELECT * FROM users WHERE username = ? AND password = SHA2(?, 256)',
      [username, password]
    );

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const user = results[0];
    const token = jwt.sign(
      { username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default authRouter;