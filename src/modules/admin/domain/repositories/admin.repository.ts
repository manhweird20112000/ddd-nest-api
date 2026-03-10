import { Admin } from '../entities/admin.entity';

/**
 * Port for admin persistence (defined in domain, implemented in infra).
 */
export abstract class AdminRepository {
  abstract save(admin: Admin): Promise<Admin>;
  abstract findByEmail(email: string): Promise<Admin | null>;
}
