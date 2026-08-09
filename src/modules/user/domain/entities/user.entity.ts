/**
 * Domain entity for an end-user profile.
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly authUserId: string,
    public readonly email: string,
    public readonly displayName: string | null,
    public readonly avatarUrl: string | null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
    public readonly deletedAt?: Date | null,
  ) {}

  withProfile(input: {
    displayName?: string | null;
    avatarUrl?: string | null;
  }): User {
    return new User(
      this.id,
      this.authUserId,
      this.email,
      input.displayName !== undefined ? input.displayName : this.displayName,
      input.avatarUrl !== undefined ? input.avatarUrl : this.avatarUrl,
      this.createdAt,
      this.updatedAt,
      this.deletedAt,
    );
  }
}
