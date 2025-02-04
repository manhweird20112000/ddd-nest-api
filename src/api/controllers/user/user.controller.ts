import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from '@/application/dtos/create-user.dto';
import { UserDomainService } from '@/domain/user/services/user-domain.service';
import { JwtAuthGuard } from '@/infra/guards/jwt-auth.guard';

@Controller({ path: 'user', version: '1' })
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userDomainService: UserDomainService) {}

  @Get('list')
  getListUser() {
    return [];
  }

  @Post('save')
  async saveUser(@Body() dto: CreateUserDto) {
    return this.userDomainService.createUser(dto);
  }
}
