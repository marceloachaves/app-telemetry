import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/postgres/schema.ts',
  out: './src/postgres/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydatabase',
  },
});