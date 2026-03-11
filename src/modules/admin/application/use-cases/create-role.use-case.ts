import { BaseUseCase } from '@/shared/common/base-use-case';
import { CreateRoleDto } from '../dtos/create-role.dto';
import { PermissionRepository, Role, RoleRepository } from '../../domain';

export class CreateRoleUseCase implements BaseUseCase<CreateRoleDto, Role> {
  constructor(private readonly roleRepository: RoleRepository, private readonly permissionRepository: PermissionRepository) {}

  async execute(input: CreateRoleDto): Promise<Role> {

    const permissions = await this.permissionRepository.findByIds(input.permission_ids);

    const role = new Role(
      0,
      input.name,
      input.description,
      permissions,
    );
    return this.roleRepository.save(role);
  }
}
