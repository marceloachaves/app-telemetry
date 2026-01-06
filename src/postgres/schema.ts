import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const devicesTable = pgTable('devices', {
  id: varchar('id', { length: 36 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  tenantId: varchar('tenant_id', { length: 36 }).notNull(),
});