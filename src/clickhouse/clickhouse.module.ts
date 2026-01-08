import { Module } from '@nestjs/common';
import { ClickHouseService } from './clickhouse.service';
import { ClickhouseTelemetryRepository } from './clickhouse-telemetry.repository';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ClickHouseService, ClickhouseTelemetryRepository],
  exports: [ClickHouseService, ClickhouseTelemetryRepository],
})
export class ClickhouseModule {}
