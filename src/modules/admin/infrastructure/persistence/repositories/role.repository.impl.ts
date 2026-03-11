import { InjectRepository } from '@nestjs/typeorm';
import { RoleOrmEntity } from '../entities/role-orm.entity';
import { In, Repository } from 'typeorm';
import { Role, RoleRepository } from '@/modules/admin/domain';
import { RoleOrmMapper } from '../mappers/role-orm.mapper';

export class RoleRepositoryImpl implements RoleRepository {
  constructor(
    @InjectRepository(RoleOrmEntity)
    private readonly roleRepository: Repository<RoleOrmEntity>,
  ) {}

  async save(role: Role): Promise<Role> {
    const orm = this.roleRepository.create(RoleOrmMapper.toOrm(role));
    const saved = await this.roleRepository.save(orm);
    return RoleOrmMapper.toDomain(saved);
  }
  async findAll(): Promise<Role[]> {
    const orms = await this.roleRepository.find();
    return orms.map(RoleOrmMapper.toDomain);
  }
  async findByIds(ids: number[]): Promise<Role[] | null> {
    const orms = await this.roleRepository.find({ where: { id: In(ids) } });
    return orms.map(RoleOrmMapper.toDomain);
  }
}
