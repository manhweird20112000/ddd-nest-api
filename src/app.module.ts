import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { SecretModule } from '@/infra/secret';
import { DatabaseModule } from '@/infra/database/database.module';
import { winstonConfig } from '@/infra/config/logger.config';
import { ContainerModules } from './modules';
import { AppController } from './app.controller';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    SecretModule,
    DatabaseModule,
    ContainerModules,
  ],
  controllers: [AppController],
})
export class AppModule {}
