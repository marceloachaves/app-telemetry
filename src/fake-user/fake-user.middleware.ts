import { Injectable, NestMiddleware } from '@nestjs/common';
import { RequestWithUser } from 'src/telemetry/infrastructure/controllers/request-user.interface';

@Injectable()
export class FakeUserMiddleware implements NestMiddleware {
  use(req: RequestWithUser, res: unknown, next: () => void) {
    req.user = {
      id: 'fake-user-id',
      name: 'Fake User',
      tenantId: 'tenant-001',
    };
    next();
  }
}
