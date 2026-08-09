import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { GetMyProfileUseCase } from '@/modules/user/application/use-cases/get-my-profile.use-case';
import { UpdateMyProfileUseCase } from '@/modules/user/application/use-cases/update-my-profile.use-case';
import { GetUserByIdUseCase } from '@/modules/user/application/use-cases/get-user-by-id.use-case';
import { UpdateProfileDto } from '@/modules/user/application/dtos/update-profile.dto';
import { GatewayUserGuard } from '../guards/gateway-user.guard';
import { CurrentAuthUserId } from '../decorators/current-auth-user-id.decorator';
import { UserPresenter, UserResponse } from '../presenters/user.presenter';

@Controller({ version: '1', path: 'users' })
export class UserController {
  constructor(
    private readonly getMyProfileUseCase: GetMyProfileUseCase,
    private readonly updateMyProfileUseCase: UpdateMyProfileUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Get('me')
  @UseGuards(GatewayUserGuard)
  async getMe(
    @CurrentAuthUserId() authUserId: string,
  ): Promise<UserResponse> {
    const user = await this.getMyProfileUseCase.execute(authUserId);
    return UserPresenter.toResponse(user);
  }

  @Patch('me')
  @UseGuards(GatewayUserGuard)
  async updateMe(
    @CurrentAuthUserId() authUserId: string,
    @Body() data: UpdateProfileDto,
  ): Promise<UserResponse> {
    const user = await this.updateMyProfileUseCase.execute({
      authUserId,
      data,
    });
    return UserPresenter.toResponse(user);
  }

  @Get(':id')
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponse> {
    const user = await this.getUserByIdUseCase.execute(id);
    return UserPresenter.toResponse(user);
  }
}
