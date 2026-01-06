import { FakeUserMiddleware } from './fake-user.middleware';

describe('FakeUserMiddleware', () => {
  it('should be defined', () => {
    expect(new FakeUserMiddleware()).toBeDefined();
  });
});
