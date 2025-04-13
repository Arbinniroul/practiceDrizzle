import config from "../../drizzle.config";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { createClient } from '@supabase/supabase-js'; 
import env from "@/lib/env";

// Use Supabase in production, local PostgreSQL in development
const connectionString = env.DATABASE_URL;

const pool = new Pool({
  connectionString,

  ...(process.env.NODE_ENV === 'production' ? { ssl: { rejectUnauthorized: false } } : {}),
});

const db = drizzle(pool);

async function main() {
  if (config.out) {
    await migrate(db, { migrationsFolder: config.out });
    console.log("Migration done!");
  }
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
  });