import 'dotenv/config';
import * as schema from './schema.js';

const url = process.env.DATABASE_URL;

let db;

if (url && (url.startsWith('pglite') || process.env.DB_DRIVER === 'pglite')) {
  const { PGlite } = await import('@electric-sql/pglite');
  const { drizzle } = await import('drizzle-orm/pglite');
  let dataDir = ':memory:';
  if (url.startsWith('pglite://')) {
    const rest = url.slice('pglite://'.length);
    if (rest && rest !== 'memory') dataDir = rest;
  }
  let lastErr;
  for (let i = 0; i < 8; i++) {
    try {
      const client = new PGlite(dataDir);
      db = drizzle(client, { schema });
      await client.query('select 1');
      break;
    } catch (e) {
      lastErr = e;
      db = undefined;
    }
  }
  if (!db) throw lastErr;
} else {
  if (!url) {
    throw new Error('DATABASE_URL must be set in environment variables');
  }
  const { neon } = await import('@neondatabase/serverless');
  const { drizzle } = await import('drizzle-orm/neon-http');
  const sql = neon(url);
  db = drizzle(sql, { schema });
}

export { db };
