import Database from 'better-sqlite3';
import { join } from 'path';

let _db: any = null;

function _getDb() {
  if (_db) return _db;

  try {
    const _dbPath = process.env.VERCEL ? '/tmp/virex.db' : join(process.cwd(), 'virex.db');
    _db = new Database(_dbPath);

    _db.exec(`
      CREATE TABLE IF NOT EXISTS urls (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        original_url TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        visits INTEGER DEFAULT 0,
        src TEXT DEFAULT 'web'
      )
    `);
    return _db;
  } catch (err: any) {
    // we return an object that throws so we can see the real error in the api response
    return {
      prepare: () => { throw new Error(`db init failed: ${err.message}`); },
      exec: () => { throw new Error(`db init failed: ${err.message}`); }
    };
  }
}

export function vxShorten(url: string, slug: string, src: string = 'web') {
  const db = _getDb();
  const stmt = db.prepare('INSERT INTO urls (slug, original_url, src) VALUES (?, ?, ?)');
  return stmt.run(slug, url, src);
}

export function vxResolve(slug: string) {
  const db = _getDb();
  try {
    const stmt = db.prepare('UPDATE urls SET visits = visits + 1 WHERE slug = ?');
    stmt.run(slug);
    return db.prepare('SELECT * FROM urls WHERE slug = ?').get(slug) as any;
  } catch {
    return null;
  }
}

export function vxListAll() {
  const db = _getDb();
  return db.prepare('SELECT * FROM urls ORDER BY created_at DESC LIMIT 50').all() as any[];
}

export function vxIsReserved(slug: string) {
  const RESERVED = new Set(['dash', 'api', 'login', 'u', 'static', 'health', 'admin', 'fetch', 'r']);
  return RESERVED.has(slug);
}

export function vxSlugExists(slug: string) {
  const db = _getDb();
  return !!db.prepare('SELECT 1 FROM urls WHERE slug = ?').get(slug);
}
