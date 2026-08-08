import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SecretModule } from '@/infra/secret';
import { HealthModule } from '@/health/health.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/infra/config/logger.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { AppController } from './app.controller';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { MathModule } from '@/modules/math/math.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'storages'),
      useGlobalPrefix: false,
      serveRoot: '/assets',
      exclude: ['/api/{*test}'],
      serveStaticOptions: {
        fallthrough: false,
        cacheControl: true,
      },
    }),
    WinstonModule.forRoot(winstonConfig),
    SecretModule,
    HealthModule,
    MathModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware).forRoutes('*');
  }
}
