export abstract class IAdapterSecret {
  APP_NAME: string;
  APP_PORT: number;

  POSTGRES_URI: string;

  JWT_SECRET: string;
  TOKEN_EXPIRATION: string;

  OPENAI_API_KEY: string;
}
