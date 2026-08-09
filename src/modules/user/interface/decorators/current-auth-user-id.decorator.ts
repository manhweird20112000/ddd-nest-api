import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentAuthUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<{ authUserId?: string }>();
    return request.authUserId;
  },
);
