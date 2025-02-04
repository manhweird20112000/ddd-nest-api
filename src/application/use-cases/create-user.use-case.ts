import { BaseUseCase } from '@/shared/infra/common/base-use-case';
import { CreateUserDto } from '@/application/dtos/create-user.dto';

export class CreateUserUseCase extends BaseUseCase<CreateUserDto, boolean> {
  execute(dto: CreateUserDto) {
    return true;
  }
}
