import { Module } from '@nestjs/common';
import { ClickhouseModule } from './clickhouse/clickhouse.module';

@Module({
  imports: [ClickhouseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
