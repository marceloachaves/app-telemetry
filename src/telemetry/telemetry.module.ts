import { Module } from '@nestjs/common';
import { TelemetryController } from './infrastructure/controllers/telemetry.controller';
import { PostgresModule } from 'src/postgres/postgres.module';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';
import { CreateTelemetryUsecase } from './domain/usecases/create-telemetry.usecase';
import { TelemetryRepositoryAbstract } from './domain/repositories/telemetry.repository';
import { ClickhouseTelemetryRepository } from 'src/clickhouse/clickhouse-telemetry.repository';

@Module({
  imports: [PostgresModule, ClickhouseModule],
  controllers: [TelemetryController],
  providers: [
    TelemetryController,
    CreateTelemetryUsecase,
    {
      provide: TelemetryRepositoryAbstract,
      useClass: ClickhouseTelemetryRepository,
    },
  ],
})
export class TelemetryModule {}
