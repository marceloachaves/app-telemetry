import { Module } from '@nestjs/common';
import { ClickHouseService } from './clickhouse.service';
import { ClickhouseTelemetryRepository } from './clickhouse-telemetry.repository';

@Module({
  providers: [ClickHouseService, ClickhouseTelemetryRepository],
  exports: [ClickHouseService, ClickhouseTelemetryRepository],
})
export class ClickhouseModule {}
