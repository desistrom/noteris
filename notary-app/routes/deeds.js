import express from 'express';
import db from '../config/database.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Get all deed types with categories
router.get('/types', (req, res) => {
  db.all('SELECT * FROM deed_types ORDER BY category, name', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    res.json({ success: true, deedTypes: rows });
  });
});

// Get deed type by ID
router.get('/types/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM deed_types WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Deed type not found' });
    }
    res.json({ success: true, deedType: row });
  });
});

// Create new deed
router.post('/', authenticateToken, (req, res) => {
  const { deed_type_id, client_name, client_email, client_phone, notes, document_data } = req.body;

  if (!deed_type_id || !client_name) {
    return res.status(400).json({ success: false, message: 'Deed type and client name are required' });
  }

  db.run(
    `INSERT INTO deeds (deed_type_id, client_name, client_email, client_phone, notes, document_data, created_by, status) 
     VALUES (?, ?, ?, ?, ?, ?, ?, 'draft')`,
    [deed_type_id, client_name, client_email || null, client_phone || null, notes || null, JSON.stringify(document_data || {}), req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error creating deed', error: err.message });
      }

      // Log initial progress
      db.run(
        `INSERT INTO deed_progress (deed_id, status, description, performed_by) VALUES (?, ?, ?, ?)`,
        [this.lastID, 'draft', 'Deed created', req.user.id]
      );

      res.status(201).json({ 
        success: true, 
        message: 'Deed created successfully',
        deedId: this.lastID 
      });
    }
  );
});

// Get all deeds (with filters)
router.get('/', authenticateToken, (req, res) => {
  const { status, deed_type_id, assigned_to, search } = req.query;
  
  let query = `
    SELECT d.*, dt.name as deed_type_name, dt.category,
           u1.username as created_by_username,
           u2.username as assigned_to_username
    FROM deeds d
    JOIN deed_types dt ON d.deed_type_id = dt.id
    LEFT JOIN users u1 ON d.created_by = u1.id
    LEFT JOIN users u2 ON d.assigned_to = u2.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND d.status = ?';
    params.push(status);
  }

  if (deed_type_id) {
    query += ' AND d.deed_type_id = ?';
    params.push(deed_type_id);
  }

  if (assigned_to) {
    query += ' AND d.assigned_to = ?';
    params.push(assigned_to);
  }

  if (search) {
    query += ' AND (d.client_name LIKE ? OR d.document_number LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  // Admins see all deeds, super_admins see all too
  query += ' ORDER BY d.created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    res.json({ success: true, deeds: rows });
  });
});

// Get deed by ID
router.get('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT d.*, dt.name as deed_type_name, dt.category, dt.required_fields,
           u1.username as created_by_username,
           u2.username as assigned_to_username
    FROM deeds d
    JOIN deed_types dt ON d.deed_type_id = dt.id
    LEFT JOIN users u1 ON d.created_by = u1.id
    LEFT JOIN users u2 ON d.assigned_to = u2.id
    WHERE d.id = ?
  `, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Database error', error: err.message });
    }
    if (!row) {
      return res.status(404).json({ success: false, message: 'Deed not found' });
    }
    res.json({ success: true, deed: row });
  });
});

// Update deed
router.put('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { client_name, client_email, client_phone, notes, document_data, status, assigned_to, document_number } = req.body;

  let updates = [];
  let params = [];

  if (client_name !== undefined) { updates.push('client_name = ?'); params.push(client_name); }
  if (client_email !== undefined) { updates.push('client_email = ?'); params.push(client_email); }
  if (client_phone !== undefined) { updates.push('client_phone = ?'); params.push(client_phone); }
  if (notes !== undefined) { updates.push('notes = ?'); params.push(notes); }
  if (document_data !== undefined) { updates.push('document_data = ?'); params.push(JSON.stringify(document_data)); }
  if (status !== undefined) { updates.push('status = ?'); params.push(status); }
  if (assigned_to !== undefined) { updates.push('assigned_to = ?'); params.push(assigned_to); }
  if (document_number !== undefined) { updates.push('document_number = ?'); params.push(document_number); }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: 'No fields to update' });
  }

  updates.push("updated_at = CURRENT_TIMESTAMP");
  params.push(id);

  db.run(
    `UPDATE deeds SET ${updates.join(', ')} WHERE id = ?`,
    params,
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error updating deed', error: err.message });
      }

      // Log progress if status changed
      if (status) {
        db.run(
          `INSERT INTO deed_progress (deed_id, status, description, performed_by) VALUES (?, ?, ?, ?)`,
          [id, status, `Status changed to ${status}`, req.user.id]
        );
      }

      res.json({ success: true, message: 'Deed updated successfully' });
    }
  );
});

// Delete deed
router.delete('/:id', authenticateToken, authorizeRole('super_admin'), (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM deeds WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Error deleting deed', error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Deed not found' });
    }
    res.json({ success: true, message: 'Deed deleted successfully' });
  });
});

export default router;
