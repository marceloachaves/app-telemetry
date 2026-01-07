import { Request } from 'express';

export interface RequestWithUser extends Request {
  user?: { tenantId: string };
}
