import { UnprocessableEntityException } from '@nestjs/common';
import { TelemetryRepositoryAbstract } from '../repositories/telemetry.repository';
import { DeviceRepositoryAbstract } from 'src/telemetry/domain/repositories/device.repository';
import { OutputTelemetryDto } from '../../application/dtos/output-telemetry.dto';
import { FakeUser } from 'src/fake-user/dominio/fake-user.entity';

export class GetTelemetryUsecase {
  constructor(
    private readonly telemetryRepository: TelemetryRepositoryAbstract,
    private readonly deviceRepository: DeviceRepositoryAbstract,
    private readonly user: FakeUser,
  ) {}

  async execute(deviceId: string): Promise<OutputTelemetryDto[]> {
    const tenantId = await this.deviceRepository.findTenantIdByDeviceId(deviceId);

    if (!tenantId) {
      return [];
    }

    if (tenantId !== this.user?.tenantId) {
      throw new UnprocessableEntityException("Device does not belong to the user's tenant");
    }

    return await this.telemetryRepository.findLatestByDevice(deviceId, 10);
  }
}
