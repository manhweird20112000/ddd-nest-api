import { Permission } from "@/modules/admin/domain";
import { PermissionOrmEntity } from "../entities/permission-orm.entity";

export class PermissionOrmMapper {
  static toDomain(orm: PermissionOrmEntity): Permission {
    return new Permission(orm.id, orm.resource, orm.action, orm.description);
  }

  static toOrm(domain: Permission): Partial<PermissionOrmEntity> {
    return {
      id: domain.id,
      resource: domain.resource,
      action: domain.action,
      description: domain.description,
    };
  }
}