import { Module } from '@nestjs/common';
import { UserAuthModule } from './user-auth';

@Module({
  imports: [UserAuthModule],
})
export class ContainerModules {}
