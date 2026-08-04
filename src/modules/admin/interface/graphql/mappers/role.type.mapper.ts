import { Role } from '../../../domain/entities/role.entity';
import { RoleType } from '../types/role.type';
import { toPermissionType } from './permission.type.mapper';

/**
 * Maps a Role domain entity to its GraphQL representation.
 */
export function toRoleType(role: Role): RoleType {
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: role.permissions?.map(toPermissionType),
  };
}
