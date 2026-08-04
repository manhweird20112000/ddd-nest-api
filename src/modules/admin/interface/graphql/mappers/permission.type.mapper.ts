import { Permission } from '../../../domain/entities/permission.entity';
import { PermissionType } from '../types/permission.type';

/**
 * Maps a Permission domain entity to its GraphQL representation.
 */
export function toPermissionType(permission: Permission): PermissionType {
  return {
    id: permission.id,
    resource: permission.resource,
    action: permission.action,
    description: permission.description,
  };
}
