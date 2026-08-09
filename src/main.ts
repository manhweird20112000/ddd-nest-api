import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { useContainer } from 'class-validator';
import compression from 'compression';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';
import { HttpSuccessInterceptor } from '@/shared/interceptors/http-success.interceptor';
import { IAdapterSecret } from '@/infra/secret/adapter';
import { ValidationPipe } from '@/shared/validation/validation.pipe';

async function bootstrap(): Promise<void> {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);
  const secret = app.get(IAdapterSecret);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [secret.RABBITMQ_URL],
      queue: secret.RABBITMQ_USER_QUEUE,
      queueOptions: { durable: true },
    },
  });

  app.use(compression({ level: 1 }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new HttpSuccessInterceptor());
  app.setGlobalPrefix('api', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: '/', method: RequestMethod.GET },
    ],
  });
  app.enableVersioning({ type: VersioningType.URI });
  app.enableShutdownHooks();

  await app.startAllMicroservices();
  await app.listen(secret.APP_PORT);
}

bootstrap();
