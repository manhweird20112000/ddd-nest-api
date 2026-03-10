import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { LoginDto } from '../../application/dtos/login.dto';
import { InvalidCredentialsException } from '@/shared/exceptions';

@Controller({
  version: '1',
  path: 'crm/auth',
})
export class CrmAuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const result = await this.loginUseCase.execute(loginDto);
      return result;
    } catch (error) {
      if (error instanceof InvalidCredentialsException) {
        throw new UnauthorizedException(error.message);
      }
      throw error;
    }
  }
}
