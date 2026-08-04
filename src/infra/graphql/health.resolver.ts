import { Query, Resolver } from '@nestjs/graphql';

/**
 * Keeps the GraphQL schema valid when no feature resolvers are registered.
 */
@Resolver()
export class HealthResolver {
  @Query(() => String, { name: 'health' })
  getHealth(): string {
    return 'ok';
  }
}
