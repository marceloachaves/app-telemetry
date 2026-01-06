import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateTelemetryDto {
  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsNumber()
  @IsNotEmpty()
  value: number;
}
