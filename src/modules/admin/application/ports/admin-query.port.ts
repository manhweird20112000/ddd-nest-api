import { Admin } from '../../domain';

export abstract class AdminQueryPort {
  abstract findByEmail(email: string): Promise<Admin | null>;
}
