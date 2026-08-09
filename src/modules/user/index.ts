import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '@/modules/user/domain';
import { UserOrmEntity } from './infrastructure/persistence/entities/user-orm.entity';
import { UserRepositoryImpl } from './infrastructure/persistence/repositories/user.repository.impl';
import { CreateUserFromEventUseCase } from './application/use-cases/create-user-from-event.use-case';
import { GetMyProfileUseCase } from './application/use-cases/get-my-profile.use-case';
import { UpdateMyProfileUseCase } from './application/use-cases/update-my-profile.use-case';
import { GetUserByIdUseCase } from './application/use-cases/get-user-by-id.use-case';
import { UserController } from './interface/controllers/user.controller';
import { UserEventsController } from './interface/controllers/user-events.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController, UserEventsController],
  providers: [
    { provide: UserRepository, useClass: UserRepositoryImpl },
    CreateUserFromEventUseCase,
    GetMyProfileUseCase,
    UpdateMyProfileUseCase,
    GetUserByIdUseCase,
  ],
})
export class UserModule {}
