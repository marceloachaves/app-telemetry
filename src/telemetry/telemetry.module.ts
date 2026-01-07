import { Module } from '@nestjs/common';
import { TelemetryController } from './infrastructure/controllers/telemetry.controller';
import { PostgresModule } from 'src/postgres/postgres.module';
import { ClickhouseModule } from 'src/clickhouse/clickhouse.module';
import { CreateTelemetryUsecase } from './application/usecases/create-telemetry.usecase';
import { TelemetryRepositoryAbstract } from './domain/telemetry.repository';
import { ClickhouseTelemetryRepository } from './infrastructure/repositories/clickhouse.repository';

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
