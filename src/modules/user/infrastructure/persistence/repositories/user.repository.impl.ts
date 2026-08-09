import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRepository } from '@/modules/user/domain';
import { UserOrmEntity } from '../entities/user-orm.entity';
import { UserOrmMapper } from '../mappers/user-orm.mapper';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private readonly mapper = new UserOrmMapper();

  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const saved = await this.repository.save(this.mapper.toOrm(user));
    return this.mapper.toDomain(saved);
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { id } });
    return orm ? this.mapper.toDomain(orm) : null;
  }

  async findByAuthUserId(authUserId: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { authUserId } });
    return orm ? this.mapper.toDomain(orm) : null;
  }
}
