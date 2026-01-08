import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  startContainers,
  stopContainers,
  postgresContainer,
  clickhouseContainer,
} from './testcontainers';
import request from 'supertest';
import { createTestDb } from './drizzle-test-client';
import { devicesTable } from '../src/postgres/schema';
import { ClickHouse } from 'clickhouse';
import { AppModule } from 'src/app.module';

describe('Integration Test (Drizzle + Postgres + ClickHouse)', () => {
  let app: INestApplication;
  let db: ReturnType<typeof createTestDb>;
  let clickhouse: ClickHouse;

  beforeAll(async () => {
    await setupContainers();
    db = await setupPostgres();
    clickhouse = await setupClickHouse();
    await setupClickHouseSchema(clickhouse);
    await setupApp();
  }, 50000);

  async function setupContainers() {
    await startContainers();
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }

  async function setupPostgres() {
    const connectionString = postgresContainer.getConnectionUri();
    const db = createTestDb(connectionString);
    await db.execute(`
      CREATE TABLE "devices" (
        "id" varchar(36) PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL,
        "tenant_id" varchar(36) NOT NULL
      );
    `);
    await db.insert(devicesTable).values([
      { id: '1', name: 'Device 1', tenantId: 'tenant-001' },
      { id: '2', name: 'Device 2', tenantId: 'tenant-001' },
      { id: '3', name: 'Device 3', tenantId: 'tenant-002' },
    ]);
    return db;
  }

  async function setupClickHouse() {
    let clickhouseInstance;
    try {
      clickhouseInstance = new ClickHouse({
        url: `http://${clickhouseContainer.getHost()}:${clickhouseContainer.getMappedPort(8123)}`,
        basicAuth: {
          username: 'meuuser',
          password: 'minhasenha',
        },
      });
    } catch (error) {
      console.error('Error creating ClickHouse client:', error);
    }
    return clickhouseInstance;
  }

  async function setupClickHouseSchema(clickhouseInstance) {
    await clickhouseInstance
      .query(`CREATE DATABASE IF NOT EXISTS telemetry;`)
      .toPromise()
      .catch((err) => {
        console.error('Error creating ClickHouse database:', err);
      });
    await clickhouseInstance
      .query(
        `
        CREATE TABLE IF NOT EXISTS telemetry.sensor_readings
        (
            device_id String NOT NULL,
            value Float64 NOT NULL,
            timestamp DateTime DEFAULT now() NOT NULL
        )
        ENGINE = MergeTree()
        ORDER BY device_id;
      `,
      )
      .toPromise()
      .catch((err) => {
        console.error('Error creating ClickHouse table:', err);
      });
    console.log(
      'Setup completo: Containers iniciados, banco de dados criado e dados de teste inseridos.',
    );
  }

  async function setupApp() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  }

  afterAll(async () => {
    await app.close();
    await stopContainers();
  }, 120000);

  it('deve rejeitar telemetria se device não pertencer ao tenant', async () => {
    // Arrange
    const createTelemetryDto = {
      deviceId: '3', // Device de tenant-002
      value: 25.0,
    };

    // Act & Assert
    const response = await request(app.getHttpServer())
      .post('/telemetry')
      .send(createTelemetryDto);

    expect(response.status).toBe(422); // UnprocessableEntityException
    expect(response.body.message).toContain(
      "does not belong to the user's tenant",
    );
  });

  it('deve aceitar telemetria se device pertencer ao tenant', async () => {
    const createTelemetryDto = {
      deviceId: '1', // Device de tenant-001
      value: 25.0,
    };

    const response = await request(app.getHttpServer())
      .post('/telemetry')
      .send(createTelemetryDto);

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Telemetry data saved successfully');
  });

  it('deve buscar telemetria apenas de devices do próprio tenant', async () => {
    // Busca dados
    const response = await request(app.getHttpServer()).get('/telemetry/1');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  }, 12000);

  it('deve rejeitar busca de telemetria de device de outro tenant', async () => {
    const response = await request(app.getHttpServer()).get('/telemetry/3');

    expect(response.status).toBe(422);
    expect(response.body.message).toContain(
      "does not belong to the user's tenant",
    );
  });
});
