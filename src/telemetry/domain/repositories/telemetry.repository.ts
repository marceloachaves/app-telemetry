import { OutputTelemetryDto } from '../../application/dtos/output-telemtry.dto';
import { Telemetry } from '../entities/telemetry.entity';

export abstract class TelemetryRepositoryAbstract {
  abstract save(telemetry: Telemetry): Promise<{ message: string }>;
  abstract findLatestByDevice(
    deviceId: string,
    limit: number,
  ): Promise<OutputTelemetryDto[]>;
}
