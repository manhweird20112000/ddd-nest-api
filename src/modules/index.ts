import { Module } from '@nestjs/common';
import { UserModule } from './user';
import { AdminModule } from './admin';
import { AdminAuthModule } from './admin-auth';
import { BotModule } from './bot';

@Module({
  imports: [UserModule, AdminModule, AdminAuthModule, BotModule],
})
export class ContainerModules {}
