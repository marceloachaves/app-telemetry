import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { createClient, ClickHouseClient } from '@clickhouse/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClickHouseService implements OnModuleInit, OnModuleDestroy {
  private static instance: ClickHouseService;
  private client: ClickHouseClient;

  @Inject(ConfigService)
  private readonly configService: ConfigService;
  private readonly logger: Logger = new Logger(ClickHouseService.name);

  constructor() {
    if (ClickHouseService.instance) {
      return ClickHouseService.instance;
    }
    ClickHouseService.instance = this;
  }

  async onModuleInit() {
    await this.connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }

  private async connect() {
    this.logger.log('Connecting to ClickHouse...');

    const url = this.configService.get<string>('CLICKHOUSE_URL');
    const username = this.configService.get<string>('CLICKHOUSE_USER');
    const password = this.configService.get<string>('CLICKHOUSE_PASSWORD');
    const database = this.configService.get<string>('CLICKHOUSE_DB');

    this.client = createClient({
      url: url || 'http://localhost:8123',
      username: username || 'admin',
      password: password || 'password',
      database: database || 'telemetry',
    });

    // Test connection
    try {
      await this.client.query({ query: 'SELECT 1', format: 'JSONEachRow' });
      this.logger.log('ClickHouse connected successfully');
    } catch (error) {
      this.logger.error('Failed to connect to ClickHouse:', error);
      throw error;
    }
  }

  private async disconnect() {
    if (this.client) {
      await this.client.close();
      this.logger.log('ClickHouse connection closed');
    }
  }

  getClient(): ClickHouseClient {
    if (!this.client) {
      throw new Error('ClickHouse client not initialized');
    }
    return this.client;
  }

  static getInstance(): ClickHouseService {
    if (!ClickHouseService.instance) {
      ClickHouseService.instance = new ClickHouseService();
    }
    return ClickHouseService.instance;
  }

  async query(sql: string, params?: Record<string, any>) {
    return await this.client.query({
      query: sql,
      query_params: params,
      format: 'JSONEachRow',
    });
  }

  async insert(table: string, data: any[]) {
    // Validar nome da tabela para evitar injection
    this.validateTableName(table);

    return await this.client.insert({
      table,
      values: data,
      format: 'JSONEachRow',
    });
  }

  async ping() {
    return await this.client.ping();
  }

  // Métodos de validação para proteção extra
  private validateTableName(tableName: string): void {
    // Permite apenas caracteres alfanuméricos, underscore e ponto (para database.table)
    const validTableNameRegex = /^[a-zA-Z0-9_]+(\.[a-zA-Z0-9_]+)?$/;

    if (!validTableNameRegex.test(tableName)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }
  }
}
