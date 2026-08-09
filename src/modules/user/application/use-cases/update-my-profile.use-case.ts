import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { User, UserRepository } from '@/modules/user/domain';
import { UpdateProfileDto } from '../dtos/update-profile.dto';

type UpdateMyProfileInput = {
  authUserId: string;
  data: UpdateProfileDto;
};

@Injectable()
export class UpdateMyProfileUseCase extends BaseUseCase<
  UpdateMyProfileInput,
  User
> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(input: UpdateMyProfileInput): Promise<User> {
    const user = await this.userRepository.findByAuthUserId(input.authUserId);
    if (!user) {
      throw new NotFoundException('User profile not found');
    }
    const updated = user.withProfile({
      displayName: input.data.displayName,
      avatarUrl: input.data.avatarUrl,
    });
    return this.userRepository.save(updated);
  }
}
