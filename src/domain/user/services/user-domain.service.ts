import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '@/infra/database/repositories/user.repository';
import { User } from '@/domain/user/entities/user.entity';
import { CreateUserDto } from '@/application/dtos/create-user.dto';
import { Password } from '@/domain/user/value-objects/password.vo';

@Injectable()
export class UserDomainService {
  constructor(private readonly userRepo: UserRepository) {}

  getUserById(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async createUser(dto: CreateUserDto) {
    const exist = await this.userRepo.findByEmail(dto.email);
    if (exist) throw new ConflictException();

    const password = await Password.create(dto.password);

    const user = new User(0, dto.name, dto.email, password);

    return this.userRepo.save(user);
  }
}
