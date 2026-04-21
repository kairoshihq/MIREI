// config/database.js - SQLite via sql.js (pure JS, no native build needed)
const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.resolve(__dirname, '../../data/mirei.db');

// Pastikan folder data ada
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db = null;

// sql.js butuh async init, tapi kita wrap agar bisa dipakai sync setelah init
let sqlJs = null;

async function initDatabase() {
  if (db) return db;

  if (!sqlJs) {
    sqlJs = await initSqlJs();
  }

  // Load existing DB file jika ada
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new sqlJs.Database(fileBuffer);
  } else {
    db = new sqlJs.Database();
  }

  // Schema
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id        INTEGER PRIMARY KEY AUTOINCREMENT,
      email     TEXT    NOT NULL UNIQUE,
      username  TEXT    NOT NULL,
      password  TEXT    NOT NULL,
      verified  INTEGER NOT NULL DEFAULT 0,
      email_verified   INTEGER NOT NULL DEFAULT 0,
      email_changed_at TEXT    DEFAULT NULL,
      last_activity_at TEXT    DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS otp_codes (
      email      TEXT    NOT NULL,
      code       TEXT    NOT NULL,
      expires_at INTEGER NOT NULL,
      PRIMARY KEY (email)
    );

    CREATE TABLE IF NOT EXISTS email_verify_tokens (
      token      TEXT    NOT NULL PRIMARY KEY,
      user_id    INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id    INTEGER NOT NULL,
      action     TEXT    NOT NULL,
      created_at TEXT    NOT NULL
    );

    CREATE TABLE IF NOT EXISTS conversations (
      id           TEXT PRIMARY KEY,
      user_id      INTEGER,
      character_id TEXT NOT NULL,
      created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chat_sessions (
      id           TEXT    PRIMARY KEY,
      user_id      INTEGER NOT NULL,
      title        TEXT    NOT NULL DEFAULT 'Percakapan baru',
      preview      TEXT    DEFAULT '',
      message_count INTEGER NOT NULL DEFAULT 0,
      created_at   TEXT    DEFAULT '',
      updated_at   TEXT    DEFAULT '',
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT    NOT NULL,
      role            TEXT    NOT NULL,
      content         TEXT    NOT NULL,
      timestamp       DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Migration: tambah kolom yang mungkin belum ada di DB lama
  const migrations = [
    "ALTER TABLE chat_sessions ADD COLUMN created_at TEXT DEFAULT ''",
    "ALTER TABLE chat_sessions ADD COLUMN updated_at TEXT DEFAULT ''",
    "ALTER TABLE chat_sessions ADD COLUMN preview TEXT DEFAULT ''",
    "ALTER TABLE chat_sessions ADD COLUMN message_count INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE users ADD COLUMN email_changed_at TEXT DEFAULT NULL",
    "ALTER TABLE users ADD COLUMN last_activity_at TEXT DEFAULT NULL",
  ];
  for (const sql of migrations) {
    try { db.run(sql); } catch (_) { /* kolom sudah ada, skip */ }
  }

  // Simpan ke file setelah setiap perubahan
  saveDatabase();

  console.log('✅ SQLite (sql.js) database ready:', DB_PATH);
  return db;
}

function saveDatabase() {
  if (!db) return;
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

function getDatabase() {
  if (!db) throw new Error('Database belum diinisialisasi. Panggil initDatabase() dulu.');
  return db;
}

// Helper: jalankan query yang mengubah data + auto-save
function dbRun(sql, params = []) {
  const d = getDatabase();
  d.run(sql, params);
  saveDatabase();
}

// Helper: ambil satu row
function dbGet(sql, params = []) {
  const d = getDatabase();
  const stmt = d.prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
}

// Helper: ambil semua rows
function dbAll(sql, params = []) {
  const d = getDatabase();
  const stmt = d.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

// Helper: insert dan return lastInsertRowid
function dbInsert(sql, params = []) {
  const d = getDatabase();
  d.run(sql, params);
  const result = d.exec('SELECT last_insert_rowid() as id');
  saveDatabase();
  return result[0]?.values[0][0];
}

module.exports = { initDatabase, getDatabase, dbRun, dbGet, dbAll, dbInsert, saveDatabase };
