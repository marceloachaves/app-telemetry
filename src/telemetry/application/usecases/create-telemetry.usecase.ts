import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Telemetry } from '../../domain/telemetry.entity';
import { TelemetryRepositoryAbstract } from '../../domain/telemetry.repository';
import { DeviceRepositoryAbstract } from 'src/telemetry/domain/device.repository';

export class CreateTelemetryUsecase {
  constructor(
    private readonly telemetryRepository: TelemetryRepositoryAbstract,
    private readonly deviceRepository: DeviceRepositoryAbstract,
    private readonly user: { tenantId: string },
  ) {}

  async execute(telemetry: Telemetry): Promise<{ message: string }> {
    const tenantId = await this.deviceRepository.findTenantIdByDeviceId(
      telemetry.deviceId,
    );

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

    return await this.telemetryRepository.save(telemetry);
  }
}
