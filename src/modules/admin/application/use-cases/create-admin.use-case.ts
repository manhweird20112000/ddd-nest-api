import { BaseUseCase } from '@/shared/common/base-use-case';
import {
  Admin,
  AdminRepository,
  AdminStatusVO,
  RoleRepository,
} from '@/modules/admin/domain';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { PasswordVO } from '@/shared/domain/value-objects';
import { Transactional } from 'typeorm-transactional';

export interface CreateAdminInput extends CreateAdminDto {
  createdBy?: number;
}

export class CreateAdminUseCase
  implements BaseUseCase<CreateAdminInput, Admin>
{
  constructor(
    private readonly adminRepository: AdminRepository,
    private readonly roleRepository: RoleRepository,
  ) {}

  @Transactional()
  async execute(input: CreateAdminInput): Promise<Admin> {
    const existing = await this.adminRepository.findByEmail(input.email);
    if (existing) {
      throw new Error('Admin with this email already exists');
    }

    const roles = await this.roleRepository.findByIds(input.role_ids);

    if (!roles.length) {
      throw new Error('Roles not found');
    }

    const password = await PasswordVO.hash(input.password);

    const admin = new Admin(
      0,
      input.name,
      input.email,
      password,
      AdminStatusVO.inactive(),
      input.createdBy,
      undefined,
      roles,
    );
    return this.adminRepository.save(admin);
  }
}
