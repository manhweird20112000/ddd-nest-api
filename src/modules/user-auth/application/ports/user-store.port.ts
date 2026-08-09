export interface StoredUser {
  readonly id: string;
  readonly email: string;
  readonly password: string;
}

export abstract class UserStorePort {
  abstract findByEmail(email: string): Promise<StoredUser | null>;
}
