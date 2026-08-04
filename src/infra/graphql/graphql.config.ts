import { ApolloDriverConfig } from '@nestjs/apollo';
import { HttpException } from '@nestjs/common';
import { GraphQLFormattedError } from 'graphql';
import * as path from 'node:path';

const SCHEMA_FILE_PATH = path.join(process.cwd(), 'src/schema.gql');
const INTERNAL_SERVER_ERROR_CODE = 'INTERNAL_SERVER_ERROR';

/**
 * Builds the Apollo driver configuration for the code-first GraphQL API.
 * Introspection and the landing page are disabled outside development.
 */
export function buildGraphqlConfig(): Omit<ApolloDriverConfig, 'driver'> {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    path: '/graphql',
    autoSchemaFile: SCHEMA_FILE_PATH,
    sortSchema: true,
    playground: false,
    introspection: !isProduction,
    context: ({ req, res }) => ({ req, res }),
    formatError: (formattedError: GraphQLFormattedError, error: unknown) =>
      formatGraphqlError(formattedError, error, isProduction),
  };
}

/**
 * Aligns GraphQL errors with the REST error envelope by exposing `status_code`
 * and the validation payload through `extensions`.
 */
function formatGraphqlError(
  formattedError: GraphQLFormattedError,
  error: unknown,
  isProduction: boolean,
): GraphQLFormattedError {
  const originalError = unwrapOriginalError(error);
  if (!(originalError instanceof HttpException)) {
    const isInternal =
      formattedError.extensions?.code === INTERNAL_SERVER_ERROR_CODE;
    return isProduction && isInternal
      ? { ...formattedError, message: 'Internal server error' }
      : formattedError;
  }
  const response = originalError.getResponse();
  const data =
    typeof response === 'object'
      ? (response as { data?: unknown }).data ?? null
      : null;
  return {
    ...formattedError,
    extensions: {
      ...formattedError.extensions,
      status_code: originalError.getStatus(),
      data,
    },
  };
}

/**
 * Apollo wraps thrown exceptions inside a GraphQLError; this reaches the cause.
 */
function unwrapOriginalError(error: unknown): unknown {
  return (error as { originalError?: unknown })?.originalError ?? error;
}
