import { ConfigService } from '@nestjs/config';
import { IAdapterSecret } from './adapter';

export class SecretService extends ConfigService implements IAdapterSecret {
  APP_NAME = this.get('APP_NAME');
  APP_PORT = Number(this.get('APP_PORT'));

  MS_HOST = this.get('MS_HOST') ?? '0.0.0.0';
  MS_PORT = Number(this.get('MS_PORT') ?? 3001);

  POSTGRES_URI = `postgres://${this.get('DB_USER')}:${this.get(
    'DB_PASSWORD',
  )}@${this.get('DB_HOST')}:${this.get('DB_PORT')}/${this.get('DB_NAME')}`;

  POSTGRES_SYNC = this.get('DB_SYNC') === 'true';

  JWT_SECRET = this.get('JWT_SECRET');
  TOKEN_EXPIRATION = this.get('TOKEN_EXPIRATION');

  STRIPE_API_KEY = this.get('STRIPE_API_KEY');
}
