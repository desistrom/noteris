import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in environment variables');
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function runMigration() {
  console.log('Running migrations...');
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('Migrations completed successfully!');
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
