import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Injectable()
export class DbService implements OnModuleDestroy {
  public pool: Pool;
  public db: ReturnType<typeof drizzle>;

  constructor(readonly configService: ConfigService) {
    let url = this.configService.get<string>('DATABASE_URL');
    if (!url) {
      url = 'postgres://user:password@localhost:5432/mydatabase';
    }

    this.pool = new Pool({
      connectionString: url,
    });
    this.db = drizzle(this.pool, { schema });
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
