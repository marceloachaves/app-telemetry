import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class FakeUserMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    req.user = { id: 'fake-user-id', name: 'Fake User' , tenantId: 'tenant-001'};
    next();
  }
}
