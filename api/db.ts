import { join } from 'path';
import fs from 'fs';

// simple json-based store for vercel because native bindings for sqlite are a nightmare in serverless
// it's ephemeral in /tmp anyway, so this is functionally equivalent?

interface UrlEntry {
  id: number;
  path: string;
  original_url: string;
  created_at: string;
  visits: number;
  src: string;
}

const DB_PATH = process.env.VERCEL ? '/tmp/virex_db.json' : join(process.cwd(), 'virex_db.json');

const RESERVED = new Set(['dash', 'api', 'login', 'u', 'static', 'health', 'admin', 'fetch', 'r']);

function read_db(): UrlEntry[] {
  try {
    if (!fs.existsSync(DB_PATH)) return [];
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('db read fail:', err);
    return [];
  }
}

function write_db(data: UrlEntry[]) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('db write fail:', err);
  }
}

export function vxshort(url: string, path: string, src = 'web') {
  const db = read_db();
  const entry: UrlEntry = {
    id: Date.now(),
    path,
    original_url: url,
    created_at: new Date().toISOString(),
    visits: 0,
    src
  };
  db.push(entry);
  write_db(db);
  return entry;
}

export function vxresolve(path: string) {
  const db = read_db();
  const idx = db.findIndex(e => e.path === path);
  if (idx === -1) return null;
  
  db[idx].visits++;
  write_db(db);
  return db[idx];
}

export function vxlistall() {
  const db = read_db();
  return [...db].sort((a, b) => b.id - a.id).slice(0, 50);
}

export function vxisreserved(path: string) {
  return RESERVED.has(path);
}

export function vxpathexist(path: string) {
  const db = read_db();
  return db.some(e => e.path === path);
}
