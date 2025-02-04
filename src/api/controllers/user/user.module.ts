import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserDomainService } from '@/domain/user/services/user-domain.service';
import { UserRepository } from '@/infra/database/repositories/user.repository';
import { UserOrmEntity } from '@/infra/database/entities/user.orm-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAppModule } from '@/infra/jwt/jwt.module';

@Module({
  imports: [JwtAppModule, TypeOrmModule.forFeature([UserOrmEntity])],
  controllers: [UserController],
  providers: [UserDomainService, UserRepository],
})
export class UserHttpModule {}
