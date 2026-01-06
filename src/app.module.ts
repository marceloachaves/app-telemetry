import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { FakeUserMiddleware } from './fake-user/fake-user.middleware';
import { ClickhouseModule } from './clickhouse/clickhouse.module';
import { PostgresModule } from './postgres/postgres.module';
import { TelemetryModule } from './telemetry/telemetry.module';


@Module({
  imports: [ClickhouseModule, PostgresModule, TelemetryModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FakeUserMiddleware).forRoutes('*');
  }
}
