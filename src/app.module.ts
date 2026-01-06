import { Module } from '@nestjs/common';
import { ClickhouseModule } from './clickhouse/clickhouse.module';
import { PostgresModule } from './postgres/postgres.module';

@Module({
  imports: [ClickhouseModule, PostgresModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
