export abstract class IAdapterSecret {
  APP_NAME: string;
  APP_PORT: number;

  POSTGRES_URI: string;
  POSTGRES_SYNC: boolean;

  JWT_SECRET: string;
  TOKEN_EXPIRATION: string;

  STRIPE_API_KEY: string;
}
