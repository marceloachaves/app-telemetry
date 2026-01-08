export class Telemetry {
  deviceId: string;
  value: number;
  timestamp: Date;

  constructor(params: { deviceId: string; value: number });
  constructor(params: { deviceId: string; value: number; timestamp: Date }) {
    this.deviceId = params.deviceId;
    this.value = params.value;
    this.timestamp = params.timestamp;
  }
}
