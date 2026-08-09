import { ConfigService } from '@nestjs/config';
import { IAdapterSecret } from './adapter';

export class SecretService extends ConfigService implements IAdapterSecret {
  APP_NAME = this.get('APP_NAME');
  APP_PORT = this.get('APP_PORT');

  JWT_SECRET = this.get('JWT_SECRET');
  TOKEN_EXPIRATION = this.get('TOKEN_EXPIRATION');

  STRIPE_API_KEY = this.get('STRIPE_API_KEY');

  AUTH_SERVICE_URL = this.get('AUTH_SERVICE_URL');
  USER_SERVICE_URL = this.get('USER_SERVICE_URL');
  LIVE_SERVICE_URL = this.get('LIVE_SERVICE_URL');
  CHAT_SERVICE_URL = this.get('CHAT_SERVICE_URL');
  MEDIA_SERVICE_URL = this.get('MEDIA_SERVICE_URL');
}
