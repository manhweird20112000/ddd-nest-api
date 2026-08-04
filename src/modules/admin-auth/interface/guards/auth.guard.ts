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
    const request = this.getRequest(context);

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException();
    }

    const token = authHeader.replace('Bearer ', '');

    const payload = await this.jwtService.verifyAccessToken(token);

    request.user = payload;

    return true;
  }

  /**
   * Resolves the incoming request; overridden by transport-specific subclasses.
   */
  protected getRequest(context: ExecutionContext) {
    return context.switchToHttp().getRequest();
  }
}
