import { Permission } from "../entities/permission.entity";

export abstract class PermissionRepository {
  abstract findByIds(ids: number[]): Promise<Permission[] | null>;
  abstract findAll(): Promise<Permission[]>;
}