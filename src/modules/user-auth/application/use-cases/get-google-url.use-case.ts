import { Injectable } from '@nestjs/common';
import { BaseUseCase } from '@/shared/common/base-use-case';
import { GoogleOauthPort } from '../ports/google-oauth.port';

type Input = void;

interface Output {
  url: string;
}

@Injectable()
export class GetGoogleUrlUseCase implements BaseUseCase<Input, Output> {
  constructor(private readonly googleOauth: GoogleOauthPort) {}

  execute(): Output {
    return { url: this.googleOauth.getAuthUrl() };
  }
}
