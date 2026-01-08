import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as requestUserInterface from './request-user.interface';
import { DeviceRepository } from 'src/postgres/device.repository';
import { CreateTelemetryDto } from 'src/telemetry/application/dtos/create-telemetry.dto';
import { TelemetryMapper } from 'src/telemetry/application/mappers/telemetry.mapper';
import { CreateTelemetryUsecase } from 'src/telemetry/domain/usecases/create-telemetry.usecase';
import { Telemetry } from 'src/telemetry/domain/entities/telemetry.entity';
import { TelemetryRepositoryAbstract } from 'src/telemetry/domain/repositories/telemetry.repository';
import { GetTelemetryUsecase } from 'src/telemetry/domain/usecases/get-telemetry.usecase';

@Controller('telemetry')
export class TelemetryController {
  constructor(
    private readonly devicesRepository: DeviceRepository,
    private readonly telemetryRepository: TelemetryRepositoryAbstract,
    // private readonly createTelemetryUsecase: CreateTelemetryUsecase,
  ) {}

  @Post()
  async create(
    @Body() createTelemetryDto: CreateTelemetryDto,
    @Req() req: requestUserInterface.RequestWithUser,
  ): Promise<{ message: string }> {
    if (!req.user) {
      throw new UnprocessableEntityException(
        'User information is missing from request',
      );
    }
    const createTelemetryUsecase = new CreateTelemetryUsecase(
      this.telemetryRepository,
      this.devicesRepository,
      req.user,
    );
    return await createTelemetryUsecase.execute(
      TelemetryMapper.fromCreateTelemetryDto(createTelemetryDto),
    );
  }

  @Get(':deviceId')
  async findByDevice(
    @Param('deviceId') deviceId: string,
    @Req() req: requestUserInterface.RequestWithUser,
  ) {
    if (!req.user) {
      throw new UnprocessableEntityException(
        'User information is missing from request',
      );
    }
    const getTelemetryUsecase = new GetTelemetryUsecase(
      this.telemetryRepository,
      this.devicesRepository,
      req.user,
    );
    return getTelemetryUsecase.execute(deviceId);
  }
}
