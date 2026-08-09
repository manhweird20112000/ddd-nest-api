import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class GatewayUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | string[] | undefined>;
      authUserId?: string;
    }>();
    const raw = request.headers['x-user-id'];
    const authUserId = Array.isArray(raw) ? raw[0] : raw;
    if (!authUserId?.trim()) {
      throw new UnauthorizedException('Missing x-user-id header');
    }
    request.authUserId = authUserId.trim();
    return true;
  }
}
