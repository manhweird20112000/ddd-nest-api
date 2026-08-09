import { Controller, UsePipes } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { GoogleCallbackDto } from '../../application/dtos/google-callback.dto';
import { ValidateTokenDto } from '../../application/dtos/validate-token.dto';
import { IJwtService } from '../../application/ports/jwt.port';
import { GetGoogleUrlUseCase } from '../../application/use-cases/get-google-url.use-case';
import { GoogleCallbackUseCase } from '../../application/use-cases/google-callback.use-case';
import { ValidationPipe } from '@/shared/validation/validation.pipe';

@Controller()
export class UserAuthMsController {
  constructor(
    private readonly getGoogleUrlUseCase: GetGoogleUrlUseCase,
    private readonly googleCallbackUseCase: GoogleCallbackUseCase,
    private readonly jwtService: IJwtService,
  ) {}

  @MessagePattern({ cmd: 'user.auth.google-url' })
  googleAuthRedirect(): { url: string } {
    return this.getGoogleUrlUseCase.execute();
  }

  @MessagePattern({ cmd: 'user.auth.google.callback' })
  @UsePipes(ValidationPipe)
  async googleAuthCallback(
    @Payload() payload: GoogleCallbackDto,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      return await this.googleCallbackUseCase.execute(payload);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Google authentication failed';
      throw new RpcException({
        statusCode: 401,
        message,
      });
    }
  }

  @MessagePattern({ cmd: 'user.auth.validate' })
  @UsePipes(ValidationPipe)
  async validate(
    @Payload() payload: ValidateTokenDto,
  ): Promise<{ sub: string; email: string }> {
    try {
      return await this.jwtService.verifyAccessToken(payload.token);
    } catch {
      throw new RpcException({
        statusCode: 401,
        message: 'Invalid token',
      });
    }
  }
}
