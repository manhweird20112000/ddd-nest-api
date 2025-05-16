import { Module } from '@nestjs/common';
import { SecretModule } from '@/infra/secret';
import { DatabaseModule } from '@/infra/database/database.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/infra/config/logger.config';
import { ContainerModules } from './modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';
import { AppController } from './app.controller';

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
    DatabaseModule,
    ContainerModules,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
