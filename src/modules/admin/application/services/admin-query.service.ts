import { AdminQueryPort } from '../ports/admin-query.port';
import { Admin, AdminRepository } from '../../domain';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminQueryService implements AdminQueryPort {
  constructor(private readonly adminRepository: AdminRepository) {}

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findByEmail(email);
  }
}
