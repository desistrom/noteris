import 'dotenv/config';

process.env.DB_DRIVER = 'pglite';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'pglite://memory';
process.env.SEED_PASSWORD = process.env.SEED_PASSWORD || 'password123';

const { db } = await import('../src/lib/db.js');
const { migrate } = await import('drizzle-orm/pglite/migrator');
const { runSeed } = await import('../src/server/seed.js');

await migrate(db, { migrationsFolder: './drizzle' });
await runSeed(db);

globalThis.__testDb = db;
