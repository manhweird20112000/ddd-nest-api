import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { GoogleOauthPort } from '../ports/google-oauth.port';
import { IJwtService } from '../ports/jwt.port';

interface Input {
  code: string;
}

interface Output {
  access_token: string;
  refresh_token: string;
}

@Injectable()
export class GoogleCallbackUseCase implements BaseUseCase<Input, Output> {
  constructor(
    private readonly googleOauth: GoogleOauthPort,
    private readonly jwtService: IJwtService,
  ) {}

  async execute(input: Input): Promise<Output> {
    const profile = await this.googleOauth.exchangeCode(input.code);
    console.log('profile', profile);
    const payload = {
      sub: profile.id,
      email: profile.email,
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
