import { BaseUseCase } from '@/shared/common/base-use-case';
import { AdminRepository } from '../../domain';
import { BadRequestException, NotFoundException } from '@nestjs/common';

interface Input {
  id: number;
  adminId: number;
}

export class DeleteAdminUseCase implements BaseUseCase<Input, boolean> {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(input: Input): Promise<boolean> {
    const admin = await this.adminRepository.findById(input.id);

    if (!admin) {
      throw new NotFoundException();
    }

    if (admin.id === input.adminId) {
      throw new BadRequestException('You cannot delete yourself');
    }

    return this.adminRepository.delete(input.id, input.adminId);
  }
}
