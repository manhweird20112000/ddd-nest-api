import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AUTH_SERVICE, USER_SERVICE } from './user-auth.constants';
import { GoogleCallbackDto } from './dto/google-callback.dto';

type AuthUserPayload = {
  sub?: string;
  email?: string;
};

type UserMeResponse = {
  id: string;
  authUserId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

@Controller({ path: 'auth', version: '1' })
export class UserAuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly client: ClientProxy,
    @Inject(USER_SERVICE) private readonly userService: ClientProxy,
  ) {}

  @Get('google-url')
  getGoogleAuthUrl(): Observable<{ url: string }> {
    return this.client.send<{ url: string }>(
      { cmd: 'user.auth.google-url' },
      {},
    );
  }

  @Post('google-callback')
  handleGoogleCallback(
    @Body() body: GoogleCallbackDto,
  ): Observable<{ access_token: string; refresh_token: string }> {
    return this.client.send<{ access_token: string; refresh_token: string }>(
      { cmd: 'user.auth.google.callback' },
      body,
    );
  }

  @Get('me')
  getMe(@Req() req: Request): Observable<UserMeResponse> {
    const authUser = req['user'] as AuthUserPayload | undefined;
    const authUserId = String(authUser?.sub ?? '').trim();
    if (!authUserId) {
      throw new UnauthorizedException('Missing authenticated user id');
    }
    return this.userService.send<UserMeResponse>('user.me', { authUserId });
  }
}
