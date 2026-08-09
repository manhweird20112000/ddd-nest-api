import { User } from '../entities/user.entity';

/**
 * Port for user persistence.
 */
export abstract class UserRepository {
  abstract save(user: User): Promise<User>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByAuthUserId(authUserId: string): Promise<User | null>;
}
