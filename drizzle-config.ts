import env from "@/lib/env";
import { defineConfig } from "drizzle-kit";


export default defineConfig({
  schema: "./src/db/schema",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,    
  strict: true,     
});