export abstract class IAdapterSecret {
  APP_NAME: string;
  APP_PORT: number;

  POSTGRES_URI: string;
  POSTGRES_SYNC: boolean;

  RABBITMQ_URL: string;
  RABBITMQ_USER_QUEUE: string;
}
