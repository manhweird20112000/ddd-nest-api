import { Admin, AdminRepository } from '@/modules/admin/domain';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { AdminOrmEntity } from '../entities/admin-orm.entity';
import { AdminOrmMapper } from '../mappers/admin-orm.mapper';

export class AdminRepositoryImpl implements AdminRepository {
  private readonly mapper = new AdminOrmMapper();

  constructor(
    @InjectRepository(AdminOrmEntity)
    private readonly adminRepository: Repository<AdminOrmEntity>,
  ) {}

  async delete(id: number, adminId: number): Promise<boolean> {
    const result = await this.adminRepository.update(
      { id, delete_at: IsNull() },
      {
        deleted_by: adminId,
        delete_at: new Date(),
      },
    );
    return result.affected > 0;
  }

  async findById(id: number): Promise<Admin | null> {
    const orm = await this.adminRepository.findOne({ where: { id } });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async save(admin: Admin): Promise<Admin> {
    const orm = this.adminRepository.create(this.mapper.toOrm(admin));
    const saved = await this.adminRepository.save(orm);
    return this.mapper.toDomain(saved);
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const orm = await this.adminRepository.findOne({ where: { email } });
    return orm ? this.mapper.toDomain(orm) : null;
  }
}
