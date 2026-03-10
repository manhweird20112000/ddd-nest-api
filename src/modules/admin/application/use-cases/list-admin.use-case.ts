import { BaseUseCase } from '@/shared/common/base-use-case';
import { AdminRepository } from '../../domain';

export class ListAdminUseCase implements BaseUseCase<any, any> {

  constructor(private readonly adminRepository: AdminRepository) {}

  async execute(input: any): Promise<any> {
    return this.adminRepository.list(input);
  }
}
