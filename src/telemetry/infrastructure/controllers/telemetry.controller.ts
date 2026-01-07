import {
  Body,
  Controller,
  Post,
  Req,
  UnprocessableEntityException,
} from '@nestjs/common';
// import { Request } from 'express';
import * as requestUserInterface from './request-user.interface';
import { DeviceRepository } from 'src/postgres/device.repository';
import { CreateTelemetryDto } from 'src/telemetry/application/dtos/create-telemetry.dto';
import { TelemetryMapper } from 'src/telemetry/application/mappers/telemetry.mapper';
import { CreateTelemetryUsecase } from 'src/telemetry/application/usecases/create-telemetry.usecase';
import { Telemetry } from 'src/telemetry/domain/telemetry.entity';
import { TelemetryRepositoryAbstract } from 'src/telemetry/domain/telemetry.repository';

// interface RequestWithUser extends Request {
//   user?: any;
// }

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
  ) {
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
    await createTelemetryUsecase.execute(
      TelemetryMapper.fromCreateTelemetryDto(createTelemetryDto),
    );
  }
}
