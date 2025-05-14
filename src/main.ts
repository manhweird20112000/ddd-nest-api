import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { HttpExceptionFilter } from '@/shared/filters/http-exception.filter';
import { HttpSuccessInterceptor } from '@/shared/interceptors/http-success.interceptor';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { IAdapterSecret } from '@/infra/secret/adapter';
import { useContainer } from 'class-validator';
import * as compression from 'compression';
import { ValidationPipe } from '@/shared/validation/validation.pipe';

async function bootstrap() {
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule);

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

  const { APP_PORT } = app.get(IAdapterSecret);

  await app.listen(APP_PORT);
}

bootstrap();
