import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { InvalidCredentialsException } from '@/shared/exceptions';
import { LoginDto } from '../dtos/login.dto';
import { IJwtService } from '../ports/jwt.port';
import { UserStorePort } from '../ports/user-store.port';

type Input = LoginDto;

interface Output {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class LoginUseCase implements BaseUseCase<Input, Output> {
  constructor(
    private readonly userStore: UserStorePort,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const user = await this.userStore.findByEmail(input.email);
    // ponytail: plain password compare; hashed User repo when DB lands
    if (!user || user.password !== input.password) {
      throw new InvalidCredentialsException();
    }
    const payload = {
      sub: user.id,
      email: user.email,
    };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAccessToken(payload),
      this.jwtService.signRefreshToken(payload),
    ]);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
