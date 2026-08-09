export abstract class IAdapterSecret {
  APP_NAME: string;
  APP_PORT: number;

  JWT_SECRET: string;
  TOKEN_EXPIRATION: string;

  STRIPE_API_KEY: string;

  AUTH_SERVICE_URL: string;
  USER_SERVICE_URL: string;
  LIVE_SERVICE_URL: string;
  CHAT_SERVICE_URL: string;
  MEDIA_SERVICE_URL: string;
}
