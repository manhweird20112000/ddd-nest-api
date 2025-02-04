import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '@/infra/database/entities/user.orm-entity';
import { Repository } from 'typeorm';
import { IUserRepository } from '@/domain/user/repositories/user.repository.interface';
import { User } from '@/domain/user/entities/user.entity';
import { UserMapper } from '@/infra/mappers/user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const user = await this.repo.findOne({ where: { id } });
    if (user) return UserMapper.toDomain(user);
    return null;
  }

  async save(user: User): Promise<User> {
    const entity = UserMapper.toPersistence(user);
    console.log(entity)
    const newUser = await this.repo.save(entity);
    return UserMapper.toDomain(newUser);
  }

  // async updateById(id: number, user: User): Promise<User> {
  //   await this.repo.update(id, user);
  //   return this.findById(id);
  // }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOne({ where: { email } });
    if (user) return UserMapper.toDomain(user);
    return null;
  }
}
