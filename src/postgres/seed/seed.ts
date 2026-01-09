import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { devicesTable } from '../schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/mydatabase',
});

const db = drizzle(pool);

async function seed() {
  await db.insert(devicesTable).values([
    {
      id: '1',
      name: 'device-1',
      tenantId: 'tenant-001',
    },
    {
      id: '2',
      name: 'device-2',
      tenantId: 'tenant-001',
    },
    {
      id: '3',
      name: 'device-3',
      tenantId: 'tenant-002',
    },
    {
      id: '4',
      name: 'device-4',
      tenantId: 'tenant-002',
    },
    {
      id: '5',
      name: 'device-5',
      tenantId: 'tenant-002',
    },
  ]);

  console.log('Seed executado com sucesso');
  process.exit(0);
}

seed();
