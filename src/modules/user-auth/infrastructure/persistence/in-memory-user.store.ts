import { Injectable } from '@nestjs/common';
import {
  StoredUser,
  UserStorePort,
} from '../../application/ports/user-store.port';

const PLACEHOLDER_USER: StoredUser = {
  id: '1',
  email: 'user@example.com',
  password: 'password123',
};

@Injectable()
export class InMemoryUserStore implements UserStorePort {
  async findByEmail(email: string): Promise<StoredUser | null> {
    if (email.toLowerCase() !== PLACEHOLDER_USER.email) {
      return null;
    }
    return PLACEHOLDER_USER;
  }
}
