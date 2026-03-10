import { Module } from '@nestjs/common';
import { UserModule } from './user';
import { AdminModule } from './admin';
import { AdminAuthModule } from './admin-auth';

@Module({
  imports: [UserModule, AdminModule, AdminAuthModule],
})
export class ContainerModules {}
