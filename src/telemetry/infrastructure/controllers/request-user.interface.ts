import { Request } from 'express';
import { FakeUser } from 'src/fake-user/dominio/fake-user.entity';

export interface RequestWithUser extends Request {
  user?: FakeUser;
}
