import { InjectRepository } from '@nestjs/typeorm';
import { RoleOrmEntity } from '../entities/role-orm.entity';
import { In, Repository } from 'typeorm';
import { Role, RoleRepository } from '@/modules/admin/domain';

export class RoleRepositoryImpl implements RoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}
  async findByIds(ids: number[]): Promise<Role[] | null> {
    const orms = await this.roleRepository.find({ where: { id: In(ids) } });
    return orms.map((orm) => new Role(orm.id, orm.name, orm.description));
  }
}
