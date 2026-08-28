import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import { JWT_SECRET, authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user (only super_admin can create admin users)
router.post('/register', (req, res) => {
  const { username, email, password, role, full_name } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  if (!['admin', 'super_admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (username, email, password, role, full_name) VALUES (?, ?, ?, ?, ?)`,
    [username, email, hashedPassword, role, full_name || null],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ success: false, message: 'Username or email already exists' });
        }
        return res.status(500).json({ success: false, message: 'Error creating user', error: err.message });
      }
      res.status(201).json({ 
        success: true, 
        message: 'User created successfully',
        userId: this.lastID 
      });
    }
  );
});

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }
    });
  });
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  db.get('SELECT id, username, email, role, full_name, created_at FROM users WHERE id = ?', [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, user });
  });
});

export default router;
