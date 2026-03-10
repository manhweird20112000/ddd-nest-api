import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IJwtService } from '../../application/ports/jwt.port';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: IJwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const token = authHeader.replace('Bearer ', '');

    const payload = await this.jwtService.verifyAccessToken(token);

    request.user = payload;

    return true;
  }
}
