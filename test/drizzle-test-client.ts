import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

export function createTestDb(connectionString: string) {
  const client = postgres(connectionString, { max: 1 });
  return drizzle(client);
}
