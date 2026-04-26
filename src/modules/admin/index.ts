import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOrmEntity } from './infrastructure/persistence/entities/admin-orm.entity';
import { RoleOrmEntity } from './infrastructure/persistence/entities/role-orm.entity';
import { CrmAdminController } from './interface/controllers/crm.controller';
import { CreateAdminUseCase } from './application/use-cases/create-admin.use-case';
import { AdminRepository } from './domain/repositories/admin.repository';
import { AdminRepositoryImpl } from './infrastructure/persistence/repositories/admin.repository.impl';
import { PermissionRepository, RoleRepository } from './domain';
import { RoleRepositoryImpl } from './infrastructure/persistence/repositories/role.repository.impl';
import { AdminQueryService } from './application/services/admin-query.service';
import { AdminQueryPort } from './application/ports/admin-query.port';
import { AdminAuthModule } from '../admin-auth';
import { forwardRef } from '@nestjs/common';
import { DeleteAdminUseCase } from './application/use-cases/delete-admin.use-case';
import { ListAdminUseCase } from './application/use-cases/list-admin.use-case';
import { PermissionOrmEntity } from './infrastructure/persistence/entities/permission-orm.entity';
import { ListRoleUseCase } from './application/use-cases/list-role.use-case';
import { PermissionRepositoryImpl } from './infrastructure/persistence/repositories/permission.repository.impl';
import { CreateRoleUseCase } from './application/use-cases/create-role.use-case';

@Module({
  imports: [
    forwardRef(() => AdminAuthModule),
    TypeOrmModule.forFeature([
      AdminOrmEntity,
      RoleOrmEntity,
      PermissionOrmEntity,
    ]),
  ],
  controllers: [CrmAdminController],
  providers: [
    {
      provide: AdminRepository,
      useClass: AdminRepositoryImpl,
    },
    {
      provide: RoleRepository,
      useClass: RoleRepositoryImpl,
    },
    {
      provide: PermissionRepository,
      useClass: PermissionRepositoryImpl,
    },
    {
      provide: AdminQueryPort,
      useClass: AdminQueryService,
    },
    CreateAdminUseCase,
    DeleteAdminUseCase,
    ListAdminUseCase,
    ListRoleUseCase,
    CreateRoleUseCase,
  ],
  exports: [AdminQueryPort],
})
export class AdminModule {}
