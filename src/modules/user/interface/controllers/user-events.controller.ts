import { Controller, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { CreateUserFromEventUseCase } from '@/modules/user/application/use-cases/create-user-from-event.use-case';
import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case';
import { UserCreatedEventDto } from '@/modules/user/application/dtos/user-created.event.dto';
import { UserProfileQueryDto } from '@/modules/user/application/dtos/user-profile.query.dto';
import {
  UserPresenter,
  UserResponse,
} from '@/modules/user/interface/presenters/user.presenter';

@Controller()
export class UserEventsController {
  private readonly logger = new Logger(UserEventsController.name);

  constructor(
    private readonly createUserFromEventUseCase: CreateUserFromEventUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @EventPattern('user.created')
  async handleUserCreated(@Payload() payload: unknown): Promise<void> {
    const dto = plainToInstance(UserCreatedEventDto, payload);
    await validateOrReject(dto);
    try {
      await this.createUserFromEventUseCase.execute(dto);
    } catch (error) {
      this.logger.error('Failed to handle user.created', error as Error);
      throw error;
    }
  }

  @MessagePattern('user.detail')
  async handleUserDetail(@Payload() payload: unknown): Promise<UserResponse> {
    const dto = plainToInstance(UserProfileQueryDto, payload);
    await validateOrReject(dto);
    try {
      const user = await this.getUserByIdUseCase.execute(dto.userId);
      return UserPresenter.toResponse(user);
    } catch (error) {
      this.logger.error('Failed to handle user.profile', error as Error);
      throw error;
    }
  }
}
