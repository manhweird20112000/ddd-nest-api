import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionGuard } from './permission.guard';

/**
 * Applies the same permission check as {@link PermissionGuard} to GraphQL
 * resolvers, reading the request from the Apollo context.
 */
@Injectable()
export class GqlPermissionGuard extends PermissionGuard {
  protected getRequest(context: ExecutionContext) {
    return GqlExecutionContext.create(context).getContext().req;
  }
}
