import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AdminRepository, PermissionRepository } from '../../domain';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly adminRepository: AdminRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const permission = this.reflector.get<string>(
      'permissions',
      context.getHandler(),
    );

    const admin = await this.adminRepository.findById(request.user.sub);
    const permissions = admin?.roles?.flatMap((role) =>
      role.permissions.map(
        (permission) => permission.resource + ':' + permission.action,
      ),
    );

    return permissions.includes(permission);
  }
}
