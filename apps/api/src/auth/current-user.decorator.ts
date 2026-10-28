import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '@supavolt/types';
import { AuthenticatedRequest } from './jwt-auth.guard';

/**
 * ini buatan sendiri untuk di parameter seperti @Body, @Query,
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
    return request['user'] as JwtPayload;
  },
);
