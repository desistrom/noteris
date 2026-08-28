import express from 'express';
import db from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get progress history for a deed
router.get('/deed/:deedId', authenticateToken, (req, res) => {
  const { deedId } = req.params;
  
  db.all(`
    SELECT dp.*, u.username as performed_by_username
    FROM deed_progress dp
    JOIN users u ON dp.performed_by = u.id
    WHERE dp.deed_id = ?
    ORDER BY dp.created_at DESC
  `, [deedId], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    res.json({ success: true, progress: rows });
  });
});

// Add progress entry
router.post('/', authenticateToken, (req, res) => {
  const { deed_id, status, description } = req.body;

  if (!deed_id || !status) {
    return res.status(400).json({ success: false, message: 'Deed ID and status are required' });
  }

  db.run(
    `INSERT INTO deed_progress (deed_id, status, description, performed_by) VALUES (?, ?, ?, ?)`,
    [deed_id, status, description || `Status updated to ${status}`, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error adding progress', error: err.message });
      }

      // Update deed status if provided
      if (status) {
        db.run(
          `UPDATE deeds SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [status, deed_id]
        );
      }

      res.status(201).json({ 
        success: true, 
        message: 'Progress added successfully',
        progressId: this.lastID 
      });
    }
  );
});

// Get dashboard statistics
router.get('/stats', authenticateToken, (req, res) => {
  const stats = {};
  
  const queries = {
    total: 'SELECT COUNT(*) as count FROM deeds',
    draft: "SELECT COUNT(*) as count FROM deeds WHERE status = 'draft'",
    in_progress: "SELECT COUNT(*) as count FROM deeds WHERE status = 'in_progress'",
    review: "SELECT COUNT(*) as count FROM deeds WHERE status = 'review'",
    approved: "SELECT COUNT(*) as count FROM deeds WHERE status = 'approved'",
    completed: "SELECT COUNT(*) as count FROM deeds WHERE status = 'completed'",
    cancelled: "SELECT COUNT(*) as count FROM deeds WHERE status = 'cancelled'"
  };

  let completed = 0;
  
  Object.keys(queries).forEach(key => {
    db.get(queries[key], [], (err, row) => {
      if (err) {
        console.error(`Error fetching ${key} stats:`, err);
      } else {
        stats[key] = row.count;
      }
      completed++;
      
      if (completed === Object.keys(queries).length) {
        res.json({ success: true, stats });
      }
    });
  });
});

export default router;
