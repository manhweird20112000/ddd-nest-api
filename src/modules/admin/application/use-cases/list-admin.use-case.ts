import { BaseUseCase } from '@/shared/common/base-use-case';
import { Admin, AdminRepository } from '../../domain';
import { Injectable } from '@nestjs/common';

export type ListAdminInput = Record<string, any>;

@Injectable()
export class ListAdminUseCase implements BaseUseCase<ListAdminInput, Admin[]> {

  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(input: ListAdminInput): Promise<Admin[]> {
    return this.adminRepository.list(input);
  }
}
