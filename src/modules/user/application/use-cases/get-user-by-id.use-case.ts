import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { User, UserRepository } from '@/modules/user/domain';

@Injectable()
export class GetUserByIdUseCase extends BaseUseCase<string, User> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    return user;
  }
}
