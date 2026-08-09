import { SecretModule } from '@/infra/secret';
import { IAdapterSecret } from '@/infra/secret/adapter';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE, USER_SERVICE } from './user-auth.constants';
import { UserAuthController } from './user-auth.controller';
import { AuthMiddleware } from '@/middleware/auth.middleware';

function parseTcpUrl(url?: string) {
  if (!url) {
    return undefined;
  }

  const parsed = new URL(url);
  return {
    host: parsed.hostname,
    port: Number(parsed.port) || undefined,
  };
}

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [SecretModule],
        inject: [IAdapterSecret],
        useFactory: (secret: IAdapterSecret) => {
          const tcpUrl = parseTcpUrl(secret.AUTH_SERVICE_URL);

          return {
            transport: Transport.TCP,
            options: {
              host: tcpUrl?.host,
              port: tcpUrl?.port,
            },
          };
        },
      },
      {
        name: USER_SERVICE,
        imports: [SecretModule],
        inject: [IAdapterSecret],
        useFactory: (secret: IAdapterSecret) => {
          const rmqUrl = secret.USER_SERVICE_URL;

          return {
            transport: Transport.RMQ,
            options: {
              urls: [rmqUrl],
              queue: 'user_service_queue',
              queueOptions: {
                durable: true,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [UserAuthController],
})
export class UserAuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: 'v1/auth/me', method: RequestMethod.GET });
  }
}
