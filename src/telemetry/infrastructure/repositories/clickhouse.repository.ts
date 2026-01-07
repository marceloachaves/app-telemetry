import { Injectable } from '@nestjs/common';
import { ClickHouseService } from 'src/clickhouse/clickhouse.service';
import { DeviceRepository } from 'src/postgres/device.repository';
import { Telemetry } from 'src/telemetry/domain/telemetry.entity';
import { TelemetryRepositoryAbstract } from 'src/telemetry/domain/telemetry.repository';

@Injectable()
export class ClickhouseTelemetryRepository extends TelemetryRepositoryAbstract {
  constructor(
    private readonly clickHouseService: ClickHouseService,
    private readonly deviceRepository: DeviceRepository,
  ) {
    super();
  }

  async save(telemetry: Telemetry): Promise<{ message: string }> {
    try {
      await this.clickHouseService.insert('telemetry.sensor_readings', [
        {
          device_id: telemetry.deviceId,
          value: telemetry.value,
        },
      ]);
      return { message: 'Telemetry data saved successfully' };
    } catch (error) {
      throw new Error(`Failed to save telemetry data: ${error.message}`);
    }
  }
}
