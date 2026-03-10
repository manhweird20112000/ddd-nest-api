import { Permission } from './permission.entity';

/**
 * Domain entity representing an admin role with optional permissions.
 */
export class Role {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly permissions?: Permission[],
  ) {}
}
