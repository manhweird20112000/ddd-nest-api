import { Role } from '@/modules/admin/domain';
import { RoleOrmEntity } from '../entities/role-orm.entity';
import { PermissionOrmMapper } from './permission-orm.mapper';
import { PermissionOrmEntity } from '../entities/permission-orm.entity';

export class RoleOrmMapper {
  static toDomain(orm: RoleOrmEntity): Role {
    return new Role(
      orm.id,
      orm.name,
      orm.description,
      orm.permissions?.map(PermissionOrmMapper.toDomain),
    );
  }

  static toOrm(domain: Role): Partial<RoleOrmEntity> {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      permissions: domain.permissions?.map((permission) =>
        Object.assign(new PermissionOrmEntity(), { id: permission.id }),
      ),
    };
  }
}
