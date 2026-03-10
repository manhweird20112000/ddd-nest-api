import { Admin } from '../../domain/entities/admin.entity';
import { Role } from '../../domain/entities/role.entity';
import { Permission } from '../../domain/entities/permission.entity';
import { AdminPresenter } from './admin.presenter';
import { RolePresenter } from './role.presenter';
import { PermissionPresenter } from './permission.presenter';

/**
 * Maps Permission entity to PermissionPresenter.
 */
function toPermissionPresenter(permission: Permission): PermissionPresenter {
  return {
    id: permission.id,
    resource: permission.resource,
    action: permission.action,
    description: permission.description,
  };
}

/**
 * Maps Role entity to RolePresenter.
 */
function toRolePresenter(role: Role): RolePresenter {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions?.map(toPermissionPresenter),
  };
}

/**
 * Maps Admin entity to AdminPresenter (excludes password).
 */
export function toAdminPresenter(admin: Admin): AdminPresenter {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    status: admin.status.getValue(),
    created_by: admin.createdBy,
    deleted_by: admin.deletedBy,
    roles: admin.roles?.map(toRolePresenter),
    created_at: admin.createdAt,
    updated_at: admin.updatedAt,
    delete_at: admin.deletedAt,
  };
}
