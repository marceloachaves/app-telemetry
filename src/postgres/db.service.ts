import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class DbService implements OnModuleDestroy {
  public readonly pool: Pool;
  public readonly db: ReturnType<typeof drizzle>;

  constructor(readonly configService: ConfigService) {
    const url = this.configService.get<string>('DATABASE_URL');

    this.pool = new Pool({
      connectionString:
        url || 'postgres://user:password@localhost:5432/mydatabase',
    });
    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
