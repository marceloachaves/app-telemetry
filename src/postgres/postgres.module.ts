import { Module } from '@nestjs/common';

import { DeviceRepository } from './device.repository';
import { DbService } from './db.service';

@Module({
  providers: [DeviceRepository, DbService],
  exports: [DeviceRepository],
})
export class PostgresModule {}
