import { Device } from 'src/telemetry/domain/entities/device.entity';
import { Inject, Injectable } from '@nestjs/common';
import { DbService } from './db.service';
import { devicesTable } from './schema';
import { eq } from 'drizzle-orm';

@Injectable()
export class DeviceRepository {
  constructor(@Inject(DbService) private readonly dbService: DbService) {}

  async findAll(): Promise<Device[]> {
    const records = await this.dbService.db.select().from(devicesTable);
    return records.map((r) => new Device(r.id, r.name, r.tenantId));
  }

  async findTenantIdByDeviceId(deviceId: string): Promise<string | null> {
    const record = await this.dbService.db
      .select({ tenantId: devicesTable.tenantId })
      .from(devicesTable)
      .where(eq(devicesTable.id, deviceId))
      .limit(1);
    return record.length > 0 ? record[0].tenantId : null;
  }
}
