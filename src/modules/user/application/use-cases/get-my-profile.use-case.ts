import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { User, UserRepository } from '@/modules/user/domain';

@Injectable()
export class GetMyProfileUseCase extends BaseUseCase<string, User> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(authUserId: string): Promise<User> {
    const user = await this.userRepository.findByAuthUserId(authUserId);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }
}
