import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JwtSignOptions } from '@nestjs/jwt';
import { IAdapterSecret } from '@/infra/secret/adapter';
import {
  IJwtService,
  JwtPayload,
} from '../../application/ports/jwt.port';

@Injectable()
export class JwtAdapter implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly secretService: IAdapterSecret,
  ) {}

  async signAccessToken(payload: JwtPayload): Promise<string> {
    const signOptions: JwtSignOptions = {
      secret: this.secretService.JWT_SECRET,
      expiresIn: this.secretService
        .TOKEN_EXPIRATION as JwtSignOptions['expiresIn'],
    };
    return this.jwtService.sign(payload, signOptions);
  }

  async signRefreshToken(payload: JwtPayload): Promise<string> {
    const signOptions: JwtSignOptions = {
      secret: this.secretService.JWT_SECRET,
      expiresIn: this.secretService
        .TOKEN_EXPIRATION as JwtSignOptions['expiresIn'],
    };
    return this.jwtService.sign(payload, signOptions);
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verify(token, {
      secret: this.secretService.JWT_SECRET,
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return this.jwtService.verify(token, {
      secret: this.secretService.JWT_SECRET,
    });
  }
}
