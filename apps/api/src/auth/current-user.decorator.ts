import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '@supavolt/types';
import { AuthenticatedRequest } from './jwt-auth.guard';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request['user'] as JwtPayload;
  },
);
