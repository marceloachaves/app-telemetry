import { Device } from 'src/telemetry/domain/device.entity';
import { db } from './db';
import { devicesTable } from './schema';
import { eq } from 'drizzle-orm';

export class DeviceRepository {
  async findAll(): Promise<Device[]> {
    const records = await db.select().from(devicesTable);
    return records.map((r) => new Device(r.id, r.name, r.tenantId));
  }

  async findTenantIdByDeviceId(deviceId: string): Promise<string | null> {
    const record = await db
      .select({ tenantId: devicesTable.tenantId })
      .from(devicesTable)
      .where(eq(devicesTable.id, deviceId))
      .limit(1);
    return record.length > 0 ? record[0].tenantId : null;
  }
}
