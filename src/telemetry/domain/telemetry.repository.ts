import { Telemetry } from './telemetry.entity';

export abstract class TelemetryRepositoryAbstract {
  abstract save(telemetry: Telemetry): Promise<{ message: string }>;
}
