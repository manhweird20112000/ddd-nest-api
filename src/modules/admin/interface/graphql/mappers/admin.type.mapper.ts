import { Admin } from '../../../domain/entities/admin.entity';
import { AdminType } from '../types/admin.type';
import { toRoleType } from './role.type.mapper';

/**
 * Maps an Admin domain entity to its GraphQL representation.
 */
export function toAdminType(admin: Admin): AdminType {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    status: admin.status.getValue(),
    createdBy: admin.createdBy,
    deletedBy: admin.deletedBy,
    roles: admin.roles?.map(toRoleType),
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt,
    deletedAt: admin.deletedAt,
  };
}
