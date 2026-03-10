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
@Module({
  imports: [
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
      provide: CreateAdminUseCase,
      inject: [AdminRepository, RoleRepository],
      useFactory(
        adminRepository: AdminRepository,
        roleRepository: RoleRepository,
      ) {
        return new CreateAdminUseCase(adminRepository, roleRepository);
      },
    },
  ],
  exports: [],
})
export class AdminModule {}
