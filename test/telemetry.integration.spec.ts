import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TelemetryController } from '../src/telemetry/infrastructure/controllers/telemetry.controller';
import { DeviceRepository } from '../src/postgres/device.repository';
import { DeviceRepositoryAbstract } from '../src/telemetry/domain/repositories/device.repository';
import { TelemetryRepositoryAbstract } from '../src/telemetry/domain/repositories/telemetry.repository';
import { CreateTelemetryUsecase } from '../src/telemetry/domain/usecases/create-telemetry.usecase';
import { GetTelemetryUsecase } from '../src/telemetry/domain/usecases/get-telemetry.usecase';
import { TelemetryMapper } from '../src/telemetry/application/mappers/telemetry.mapper';
import { RequestWithUser } from '../src/telemetry/infrastructure/controllers/request-user.interface';

// Mocks
const mockDeviceRepository = {
  findTenantIdByDeviceId: jest.fn(),
};

const mockTelemetryRepository = {
  save: jest.fn(),
  findLatestByDevice: jest.fn(),
};

describe('TelemetryController (integration, isolated)', () => {
  let app: INestApplication;
  let deviceRepository: typeof mockDeviceRepository;
  let telemetryRepository: typeof mockTelemetryRepository;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [TelemetryController],
      providers: [
        { provide: DeviceRepositoryAbstract, useValue: mockDeviceRepository },
        { provide: TelemetryRepositoryAbstract, useValue: mockTelemetryRepository },
        { provide: DeviceRepository, useValue: mockDeviceRepository },
        CreateTelemetryUsecase,
        GetTelemetryUsecase,
        TelemetryMapper,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    // Simula o middleware de usuário
    app.use((req, res, next) => {
      (req as RequestWithUser).user = { id: 'fake-user-id', name: 'Fake User', tenantId: 'tenant-001' };
      next();
    });
    await app.init();
    deviceRepository = moduleRef.get(DeviceRepositoryAbstract);
    telemetryRepository = moduleRef.get(TelemetryRepositoryAbstract);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should reject telemetry if device does not belong to tenant', async () => {
    deviceRepository.findTenantIdByDeviceId.mockResolvedValue('tenant-002');
    const createTelemetryDto = { deviceId: '3', value: 25.0 };
    const response = await request(app.getHttpServer()).post('/telemetry').send(createTelemetryDto);
    expect(response.status).toBe(422);
    expect(response.body.message).toContain("does not belong to the user's tenant");
  });

  it('should accept telemetry if device belongs to tenant', async () => {
    deviceRepository.findTenantIdByDeviceId.mockResolvedValue('tenant-001');
    telemetryRepository.save.mockResolvedValue({ message: 'Telemetry data saved successfully' });
    const createTelemetryDto = { deviceId: '1', value: 25.0 };
    const response = await request(app.getHttpServer()).post('/telemetry').send(createTelemetryDto);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Telemetry data saved successfully');
  });

  it('should fetch telemetry only for devices of the tenant', async () => {
    deviceRepository.findTenantIdByDeviceId.mockResolvedValue('tenant-001');
    telemetryRepository.findLatestByDevice.mockResolvedValue([{ value: 25.0, timestamp: new Date() }]);
    const response = await request(app.getHttpServer()).get('/telemetry/1');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should reject fetching telemetry for device of another tenant', async () => {
    deviceRepository.findTenantIdByDeviceId.mockResolvedValue('tenant-002');
    const response = await request(app.getHttpServer()).get('/telemetry/3');
    expect(response.status).toBe(422);
    expect(response.body.message).toContain("does not belong to the user's tenant");
  });
});
