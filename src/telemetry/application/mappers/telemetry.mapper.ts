import { Telemetry } from '../../domain/telemetry.entity';
import { CreateTelemetryDto } from '../dtos/create-telemetry.dto';

export class TelemetryMapper {
  static toCreateTelemetryDto(entity: Telemetry): CreateTelemetryDto {
    return {
      deviceId: entity.deviceId,
      value: entity.value,
    };
  }

  static fromCreateTelemetryDto(dto: CreateTelemetryDto): Telemetry {
    return new Telemetry({
      deviceId: dto.deviceId,
      value: dto.value,
    });
  }
}
