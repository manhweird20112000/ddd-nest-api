import { ConfigService } from '@nestjs/config';
import { IAdapterSecret } from './adapter';

export class SecretService extends ConfigService implements IAdapterSecret {
  APP_NAME = this.get<string>('APP_NAME') ?? 'user-service';
  APP_PORT = Number(this.get('APP_PORT') ?? 3000);

  POSTGRES_URI = `postgres://${this.get('DB_USER')}:${this.get(
    'DB_PASSWORD',
  )}@${this.get('DB_HOST')}:${this.get('DB_PORT')}/${this.get('DB_NAME')}`;

  POSTGRES_SYNC = this.get('DB_SYNC') === 'true';

  RABBITMQ_URL =
    this.get<string>('RABBITMQ_URL') ?? 'amqp://guest:guest@127.0.0.1:5672';

  RABBITMQ_USER_QUEUE =
    this.get<string>('RABBITMQ_USER_QUEUE') ?? 'user_service_queue';
}
