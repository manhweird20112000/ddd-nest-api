import { Role } from '../entities/role.entity';

export abstract class RoleRepository {
  abstract findByIds(ids: number[]): Promise<Role[] | null>;
  abstract findAll(): Promise<Role[]>;
  abstract save(role: Role): Promise<Role>;
}
