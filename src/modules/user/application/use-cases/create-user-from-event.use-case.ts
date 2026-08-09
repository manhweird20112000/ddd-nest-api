import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { User, UserRepository } from '@/modules/user/domain';
import { UserCreatedEventDto } from '../dtos/user-created.event.dto';

@Injectable()
export class CreateUserFromEventUseCase extends BaseUseCase<
  UserCreatedEventDto,
  User
> {
  constructor(private readonly userRepository: UserRepository) {
    super();
  }

  async execute(input: UserCreatedEventDto): Promise<User> {
    const existing = await this.userRepository.findByAuthUserId(
      input.authUserId,
    );
    if (existing) {
      return existing;
    }
    const user = new User(
      randomUUID(),
      input.authUserId,
      input.email.toLowerCase(),
      input.displayName ?? null,
      null,
    );
    return this.userRepository.save(user);
  }
}
