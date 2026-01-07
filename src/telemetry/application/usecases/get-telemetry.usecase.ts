import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Telemetry } from '../../domain/telemetry.entity';
import { TelemetryRepositoryAbstract } from '../../domain/telemetry.repository';
import { DeviceRepositoryAbstract } from 'src/telemetry/domain/device.repository';
import { OutputTelemetryDto } from '../dtos/output-telemtry.dto';

export class GetTelemetryUsecase {
  constructor(
    private readonly telemetryRepository: TelemetryRepositoryAbstract,
    private readonly deviceRepository: DeviceRepositoryAbstract,
    private readonly user: { tenantId: string },
  ) {}

  async execute(deviceId: string): Promise<OutputTelemetryDto[]> {
    const tenantId =
      await this.deviceRepository.findTenantIdByDeviceId(deviceId);

    if (!tenantId) {
      throw new UnprocessableEntityException(
        'Device not found or does not exist',
      );
    }

    if (tenantId !== this.user?.tenantId) {
      throw new UnprocessableEntityException(
        "Device does not belong to the user's tenant",
      );
    }

    return await this.telemetryRepository.findLatestByDevice(deviceId, 10);
  }
}
