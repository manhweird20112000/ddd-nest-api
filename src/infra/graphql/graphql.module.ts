import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { buildGraphqlConfig } from './graphql.config';
import { HealthResolver } from './health.resolver';

/**
 * Wires the code-first GraphQL endpoint at `/graphql`.
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...buildGraphqlConfig(),
    }),
  ],
  providers: [HealthResolver],
})
export class GraphqlModule {}
