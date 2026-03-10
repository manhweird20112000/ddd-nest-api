import { Module } from '@nestjs/common';
import { UserModule } from './user';
import { AdminModule } from './admin';

@Module({
  imports: [UserModule, AdminModule],
})
export class ContainerModules {}
