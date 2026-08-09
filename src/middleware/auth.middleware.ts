import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { IAdapterSecret } from '@/infra/secret/adapter';
import { SecretService } from '@/infra/secret/service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly secretService = new SecretService();

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || typeof authHeader !== 'string') {
      throw new UnauthorizedException('Missing authorization header');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization format');
    }

    try {
      const payload = jwt.verify(
        token,
        this.secretService.JWT_SECRET as string,
      ) as {
        sub?: string;
        email?: string;
        [key: string]: unknown;
      };

      req['user'] = payload;
      req.headers.authorization = `Bearer ${token}`;
      req.headers['x-auth-token'] = token;
      req.headers['x-user-id'] = String(payload.sub ?? '');
      req.headers['x-user-email'] = String(payload.email ?? '');

      next();
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
