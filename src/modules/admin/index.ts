import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminOrmEntity } from './infra/databases/orm/entities/admin-orm.entity';
import { RoleOrmEntity } from './infra/databases/orm/entities/role-orm.entity';
import { RolePermissionOrmEntity } from './infra/databases/orm/entities/permission-orm.entity';
import { CrmAdminController } from './interface/controllers/crm.controller';
import { CreateAdminUseCase } from './application/use-cases/create-admin.use-case';
import { AdminRepository } from './domain/repositories/admin.repository';
import { AdminRepositoryImpl } from './infra/databases/orm/repositories/admin.repository.impl';
import { RoleRepository } from './domain';
import { RoleRepositoryImpl } from './infra/databases/orm/repositories/role.repository.impl';
import { AdminQueryService } from './application/services/admin-query.service';
import { AdminQueryPort } from './application/ports/admin-query.port';
import { AdminAuthModule } from '../admin-auth';
import { forwardRef } from '@nestjs/common';
import { DeleteAdminUseCase } from './application/use-cases/delete-admin.use-case';
import { ListAdminUseCase } from './application/use-cases/list-admin.use-case';
@Module({
  imports: [
    forwardRef(() => AdminAuthModule),
    TypeOrmModule.forFeature([
      AdminOrmEntity,
      RoleOrmEntity,
      RolePermissionOrmEntity,
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
      provide: AdminQueryPort,
      inject: [AdminRepository],
      useFactory(adminRepository: AdminRepository) {
        return new AdminQueryService(adminRepository);
      },
    },
    {
      provide: CreateAdminUseCase,
      inject: [AdminRepository, RoleRepository],
      useFactory(
        adminRepository: AdminRepository,
        roleRepository: RoleRepository,
      ) {
        return new CreateAdminUseCase(adminRepository, roleRepository);
      },
    },
    {
      provide: DeleteAdminUseCase,
      inject: [AdminRepository],
      useFactory(adminRepository: AdminRepository) {
        return new DeleteAdminUseCase(adminRepository);
      },
    },
    {
      provide: ListAdminUseCase,
      inject: [AdminRepository],
      useFactory(adminRepository: AdminRepository) {
        return new ListAdminUseCase(adminRepository);
      },
    }
  ],
  exports: [AdminQueryPort],
})
export class AdminModule {}
