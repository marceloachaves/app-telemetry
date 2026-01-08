import { Module } from '@nestjs/common';

import { DeviceRepository } from './device.repository';
import { DbService } from './db.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DeviceRepository, DbService],
  exports: [DeviceRepository],
})
export class PostgresModule {}
