import { PasswordVO } from '@/shared/domain/value-objects';
import { Role } from './role.entity';
import { AdminStatusVO } from '../value-objects/admin-status.vo';

/**
 * Domain entity representing an admin user.
 */
export class Admin {
  /**
   * Verifies that the given plain password matches the admin's hashed password.
   */
  async verifyPassword(plainPassword: string): Promise<boolean> {
    return PasswordVO.compare(plainPassword, this.password.value);
  }

  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly password: PasswordVO,
    public readonly status: AdminStatusVO,
    public readonly createdBy?: number,
    public readonly deletedBy?: number,
    public readonly roles?: Role[],
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date,
  ) {}
}
