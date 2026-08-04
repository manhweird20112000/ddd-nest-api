import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { buildGraphqlConfig } from './graphql.config';

/**
 * Wires the code-first GraphQL endpoint at `/graphql`, alongside the REST API.
 */
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      ...buildGraphqlConfig(),
    }),
  ],
})
export class GraphqlModule {}
