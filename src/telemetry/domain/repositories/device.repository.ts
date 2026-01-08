export abstract class DeviceRepositoryAbstract {
  abstract findTenantIdByDeviceId(deviceId: string): Promise<string | null>;
}
