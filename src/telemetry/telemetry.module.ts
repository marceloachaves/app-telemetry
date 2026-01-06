import { Module } from '@nestjs/common';
import { TelemetryController } from './infrastructure/controllers/telemetry.controller';

@Module({
    controllers: [TelemetryController],
    providers: [TelemetryController],
})
export class TelemetryModule {}
