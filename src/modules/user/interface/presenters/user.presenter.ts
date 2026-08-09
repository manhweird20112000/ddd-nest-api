import { User } from '@/modules/user/domain';

export type UserResponse = {
  id: string;
  authUserId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class UserPresenter {
  static toResponse(user: User): UserResponse {
    return {
      id: user.id,
      authUserId: user.authUserId,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
