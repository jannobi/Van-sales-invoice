const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '../data/database.db');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath);

// Create tables if not exists
db.serialize(() => {
  // Settings table
  db.run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Offline invoices table
  db.run(`
    CREATE TABLE IF NOT EXISTS offline_invoices (
      id TEXT PRIMARY KEY,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      synced BOOLEAN DEFAULT 0
    )
  `);

  // Local parties table
  db.run(`
    CREATE TABLE IF NOT EXISTS local_parties (
      id TEXT PRIMARY KEY,
      data TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Helper functions
function getSetting(key) {
  return new Promise((resolve, reject) => {
    db.get('SELECT value FROM settings WHERE key = ?', [key], (err, row) => {
      if (err) reject(err);
      resolve(row ? JSON.parse(row.value) : null);
    });
  });
}

function setSetting(key, value) {
  return new Promise((resolve, reject) => {
    const jsonValue = JSON.stringify(value);
    db.run(
      'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [key, jsonValue],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

function saveOfflineInvoice(data) {
  return new Promise((resolve, reject) => {
    const id = `offline_${Date.now()}`;
    db.run(
      'INSERT INTO offline_invoices (id, data) VALUES (?, ?)',
      [id, JSON.stringify(data)],
      (err) => {
        if (err) reject(err);
        resolve(id);
      }
    );
  });
}

function getOfflineInvoices() {
  return new Promise((resolve, reject) => {
    db.all('SELECT * FROM offline_invoices WHERE synced = 0', (err, rows) => {
      if (err) reject(err);
      resolve(rows || []);
    });
  });
}

function markInvoiceSynced(id) {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE offline_invoices SET synced = 1 WHERE id = ?',
      [id],
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

module.exports = {
  db,
  getSetting,
  setSetting,
  saveOfflineInvoice,
  getOfflineInvoices,
  markInvoiceSynced
};
