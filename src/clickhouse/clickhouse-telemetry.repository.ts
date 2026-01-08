import { Injectable } from '@nestjs/common';
import { ClickHouseService } from 'src/clickhouse/clickhouse.service';
import { OutputTelemetryDto } from 'src/telemetry/application/dtos/output-telemtry.dto';
import { Telemetry } from 'src/telemetry/domain/entities/telemetry.entity';
import { TelemetryRepositoryAbstract } from 'src/telemetry/domain/repositories/telemetry.repository';

@Injectable()
export class ClickhouseTelemetryRepository extends TelemetryRepositoryAbstract {
  constructor(private readonly clickHouseService: ClickHouseService) {
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

  async findLatestByDevice(
    deviceId: string,
    limit: number = 10,
  ): Promise<OutputTelemetryDto[]> {
    try {
      const result = await this.clickHouseService.query(
        "SELECT device_id AS deviceId, value, toTimeZone(timestamp, 'America/Sao_Paulo') AS timestamp FROM telemetry.sensor_readings WHERE device_id = {device_id:String} ORDER BY timestamp DESC LIMIT {limit:UInt32}",
        { device_id: deviceId, limit },
      );
      return await result.json();
    } catch (error) {
      console.error('ClickHouse query error:', error);
      throw new Error(
        `Failed to retrieve telemetry data for device: ${error.message}`,
      );
    }
  }
}
