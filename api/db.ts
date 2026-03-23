import Database from 'better-sqlite3';
import { join } from 'path';

// reconstructing this on every call was wasteful
const RESERVED = new Set(['dash', 'api', 'login', 'u', 'static', 'health', 'admin', 'fetch', 'r']);

let _db: Database.Database | null = null;

function getdb() {
  if (_db) return _db;
  try {
    const db_path = process.env.VERCEL ? '/tmp/virex.db' : join(process.cwd(), 'virex.db');
    _db = new Database(db_path);
    _db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        visits INTEGER DEFAULT 0,
        src TEXT DEFAULT 'web'
      )
    `);
    return _db;
  } catch (err: any) {
    // return an object that throws so we see real error in the api response
    return {
      prepare: () => { throw new Error(`db init failed: ${err.message}`); },
      exec: () => { throw new Error(`db init failed: ${err.message}`); }
    };
  }
}

export function vxshort(url: string, path: string, src = 'web') {
  return getdb().prepare('INSERT INTO urls (path, original_url, src) VALUES (?, ?, ?)').run(path, url, src);
}

export function vxresolve(path: string) {
  try {
    // UPDATE + RETURNING saves a round trip vs two separate statements
    return getdb()
      .prepare('UPDATE urls SET visits = visits + 1 WHERE path = ? RETURNING *')
      .get(path) as any ?? null;
  } catch {
    return null;
  }
}

export function vxlistall() {
  // later: pagination if this ever gets big, 50 is fine for now though lmfao
  return getdb().prepare('SELECT * FROM urls ORDER BY created_at DESC LIMIT 50').all() as any[];
}

export function vxisreserved(path: string) {
  return RESERVED.has(path);
}

export function vxpathexist(path: string) {
  return !!getdb().prepare('SELECT 1 FROM urls WHERE path = ?').get(path);
}