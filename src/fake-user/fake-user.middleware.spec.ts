import { RequestWithUser } from 'src/telemetry/infrastructure/controllers/request-user.interface';
import { FakeUserMiddleware } from './fake-user.middleware';

describe('FakeUserMiddleware', () => {
  let middleware: FakeUserMiddleware;

  beforeEach(() => {
    middleware = new FakeUserMiddleware();
  });

  it('should be defined', () => {
    expect(middleware).toBeDefined();
  });

  it('should attach a fake user to the request object', () => {
    const req = {} as RequestWithUser;
    const res = {} as unknown;
    const next = jest.fn();

    middleware.use(req, res, next);

    expect(req.user).toEqual({
      id: 'fake-user-id',
      name: 'Fake User',
      tenantId: 'tenant-001',
    });
    expect(next).toHaveBeenCalled();
  });
});
