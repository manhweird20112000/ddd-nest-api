import { Module } from '@nestjs/common';
import { UserController } from '@/modules/user/interfaces/http/controllers/user.controller';

@Module({
  imports: [],
  controllers: [UserController],
})
export class UserModule {}
