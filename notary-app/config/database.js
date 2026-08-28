const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'notary.db');
const db = new sqlite3.Database(dbPath);

// Enable foreign keys
db.run('PRAGMA foreign_keys = ON');

// Initialize database tables
const initializeDatabase = () => {
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin', 'super_admin')),
      full_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Deed types table
  db.run(`
    CREATE TABLE IF NOT EXISTS deed_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      template TEXT,
      required_fields TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Deeds table
  db.run(`
    CREATE TABLE IF NOT EXISTS deeds (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deed_type_id INTEGER NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT,
      client_phone TEXT,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'in_progress', 'review', 'approved', 'completed', 'cancelled')),
      document_number TEXT,
      document_data TEXT,
      notes TEXT,
      created_by INTEGER NOT NULL,
      assigned_to INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_at DATETIME,
      FOREIGN KEY (deed_type_id) REFERENCES deed_types(id),
      FOREIGN KEY (created_by) REFERENCES users(id),
      FOREIGN KEY (assigned_to) REFERENCES users(id)
    )
  `);

  // Progress tracking table
  db.run(`
    CREATE TABLE IF NOT EXISTS deed_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deed_id INTEGER NOT NULL,
      status TEXT NOT NULL,
      description TEXT,
      performed_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deed_id) REFERENCES deeds(id),
      FOREIGN KEY (performed_by) REFERENCES users(id)
    )
  `);

  // Documents table
  db.run(`
    CREATE TABLE IF NOT EXISTS documents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deed_id INTEGER NOT NULL,
      document_name TEXT NOT NULL,
      document_path TEXT,
      document_type TEXT NOT NULL,
      uploaded_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (deed_id) REFERENCES deeds(id),
      FOREIGN KEY (uploaded_by) REFERENCES users(id)
    )
  `);

  // Insert default deed types
  const deedTypes = [
    // Pendirian Perusahaan
    { category: 'Pendirian Perusahaan', name: 'Akta Pendirian PT', required_fields: JSON.stringify(['company_name', 'address', 'capital', 'directors', 'commissioners', 'shareholders']) },
    { category: 'Pendirian Perusahaan', name: 'Akta Pendirian Yayasan', required_fields: JSON.stringify(['foundation_name', 'address', 'purpose', 'organizers', 'assets']) },
    { category: 'Pendirian Perusahaan', name: 'Akta Pendirian CV', required_fields: JSON.stringify(['cv_name', 'address', 'capital', 'active_partners', 'silent_partners']) },
    { category: 'Pendirian Perusahaan', name: 'Akta Pendirian Koperasi', required_fields: JSON.stringify(['cooperative_name', 'address', 'purpose', 'members', 'capital']) },
    { category: 'Pendirian Perusahaan', name: 'Akta Perubahan Anggaran Dasar', required_fields: JSON.stringify(['company_name', 'changes', 'previous_deed_number', 'approval_date']) },
    
    // Transaksi Aset
    { category: 'Transaksi Aset', name: 'Akta Jual Beli Tanah', required_fields: JSON.stringify(['seller_name', 'buyer_name', 'land_location', 'land_area', 'price', 'certificate_number']) },
    { category: 'Transaksi Aset', name: 'Akta Jual Beli Properti', required_fields: JSON.stringify(['seller_name', 'buyer_name', 'property_location', 'property_type', 'price', 'certificate_number']) },
    { category: 'Transaksi Aset', name: 'Akta Jual Beli Kendaraan', required_fields: JSON.stringify(['seller_name', 'buyer_name', 'vehicle_type', 'vehicle_number', 'chassis_number', 'price']) },
    
    // Perjanjian
    { category: 'Perjanjian', name: 'Perjanjian Kredit', required_fields: JSON.stringify(['creditor_name', 'debtor_name', 'loan_amount', 'interest_rate', 'term', 'collateral']) },
    { category: 'Perjanjian', name: 'Perjanjian Sewa-Menyewa', required_fields: JSON.stringify(['lessor_name', 'lessee_name', 'object', 'rental_amount', 'duration', 'payment_terms']) },
    { category: 'Perjanjian', name: 'Perjanjian Kerja Sama Bisnis', required_fields: JSON.stringify(['party1_name', 'party2_name', 'cooperation_type', 'profit_sharing', 'duration', 'responsibilities']) },
    { category: 'Perjanjian', name: 'Pengakuan Utang', required_fields: JSON.stringify(['debtor_name', 'creditor_name', 'debt_amount', 'reason', 'repayment_terms']) },
    
    // Waris dan Hibah
    { category: 'Waris dan Hibah', name: 'Akta Hak Waris', required_fields: JSON.stringify(['deceased_name', 'heirs', 'estate_details', 'distribution']) },
    { category: 'Waris dan Hibah', name: 'Akta Wasiat', required_fields: JSON.stringify(['testator_name', 'beneficiaries', 'assets', 'conditions']) },
    { category: 'Waris dan Hibah', name: 'Akta Hibah', required_fields: JSON.stringify(['donor_name', 'donee_name', 'gift_details', 'conditions']) }
  ];

  db.serialize(() => {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO deed_types (category, name, required_fields) 
      VALUES (?, ?, ?)
    `);
    
    deedTypes.forEach(type => {
      stmt.run(type.category, type.name, type.required_fields);
    });
    
    stmt.finalize();
  });

  // Create default super admin user
  db.get('SELECT * FROM users WHERE role = ?', ['super_admin'], (err, row) => {
    if (!row) {
      const hashedPassword = bcrypt.hashSync('admin123', 10);
      db.run(
        `INSERT INTO users (username, email, password, role, full_name) 
         VALUES (?, ?, ?, ?, ?)`,
        ['superadmin', 'superadmin@notary.com', hashedPassword, 'super_admin', 'Super Administrator']
      );
      console.log('Default super admin created: superadmin / admin123');
    }
  });

  console.log('Database initialized successfully');
};

initializeDatabase();

module.exports = db;
