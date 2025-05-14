import { Module } from '@nestjs/common';
import { SecretModule } from '@/infra/secret';
import { DatabaseModule } from '@/infra/database/database.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from '@/infra/config/logger.config';
import { ContainerModules } from './modules';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    SecretModule,
    DatabaseModule,
    ContainerModules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
