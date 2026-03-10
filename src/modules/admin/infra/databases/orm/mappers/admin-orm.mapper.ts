import { Admin, AdminStatusVO, Role } from '@/modules/admin/domain';
import { AdminOrmEntity } from '../entities/admin-orm.entity';
import { PasswordVO } from '@/shared/domain/value-objects';
import { RoleOrmEntity } from '../entities/role-orm.entity';

/**
 * Maps between domain Admin and persistence AdminOrmEntity.
 */
export class AdminOrmMapper {
  /**
   * Maps ORM entity to domain Admin.
   */
  toDomain(orm: AdminOrmEntity): Admin {
    return new Admin(
      orm.id,
      orm.name,
      orm.email,
      new PasswordVO(orm.password),
      new AdminStatusVO(orm.status),
      orm.created_by,
      orm.deleted_by,
      orm.roles?.map((role) => new Role(role.id, role.name, role.description)),
      orm.created_at,
      orm.updated_at,
      orm.delete_at,
    );
  }

  /**
   * Maps domain Admin to ORM entity (for save).
   * Links to existing roles by id only (roles must be seeded beforehand).
   */
  toOrm(admin: Admin): Partial<AdminOrmEntity> {
    return {
      ...(admin.id > 0 && { id: admin.id }),
      name: admin.name,
      email: admin.email,
      password: admin.password.getValue(),
      status: admin.status.getValue(),
      created_by: admin.createdBy,
      deleted_by: admin.deletedBy,
      roles: admin.roles?.map((role) =>
        Object.assign(new RoleOrmEntity(), { id: role.id }),
      ),
    };
  }
}
