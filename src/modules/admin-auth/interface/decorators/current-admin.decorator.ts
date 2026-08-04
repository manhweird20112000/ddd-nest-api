import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request =
      ctx.getType<GqlContextType>() === 'graphql'
        ? GqlExecutionContext.create(ctx).getContext().req
        : ctx.switchToHttp().getRequest();

    return request.user;
  },
);
