import { Admin } from '../entities/admin.entity';

/**
 * Port for admin persistence (defined in domain, implemented in infra).
 */
export abstract class AdminRepository {
  abstract save(admin: Admin): Promise<Admin>;
  abstract findByEmail(email: string): Promise<Admin | null>;
  abstract findById(id: number): Promise<Admin | null>;
  abstract delete(id: number, deletedBy: number): Promise<boolean>;
  abstract list(query: Record<string, any>): Promise<Admin[]>;
}
