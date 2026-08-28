import express from 'express';
import db from '../config/database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all users (super_admin only)
router.get('/', authenticateToken, authorizeRole('super_admin'), (req, res) => {
  db.all('SELECT id, username, email, role, full_name, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    res.json({ success: true, users: rows });
  });
});

// Get user by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT id, username, email, role, full_name, created_at FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: row });
  });
});

// Update user
router.put('/:id', authenticateToken, authorizeRole('super_admin'), (req, res) => {
  const { id } = req.params;
  const { email, full_name, role } = req.body;

  let updates = [];
  let params = [];

  if (email !== undefined) { updates.push('email = ?'); params.push(email); }
  if (full_name !== undefined) { updates.push('full_name = ?'); params.push(full_name); }
  if (role !== undefined) { 
    if (!['admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    updates.push('role = ?'); 
    params.push(role); 
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  params.push(id);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(400).json({ success: false, message: 'Email already exists' });
        }
        return res.status(500).json({ success: false, message: 'Error updating user', error: err.message });
      }
      res.json({ success: true, message: 'User updated successfully' });
    }
  );
});

// Delete user (super_admin only)
router.delete('/:id', authenticateToken, authorizeRole('super_admin'), (req, res) => {
  const { id } = req.params;
  
  // Prevent deleting yourself
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error deleting user', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  });
});

export default router;
