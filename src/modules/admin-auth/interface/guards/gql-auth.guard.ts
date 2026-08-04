import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from './auth.guard';

/**
 * Applies the same JWT verification as {@link AuthGuard} to GraphQL resolvers,
 * reading the request from the Apollo context instead of the HTTP context.
 */
@Injectable()
export class GqlAuthGuard extends AuthGuard {
  protected getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }
}
