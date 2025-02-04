import { UserOrmEntity } from '@/infra/database/entities/user.orm-entity';
import { User } from '@/domain/user/entities/user.entity';
import { Password } from '@/domain/user/value-objects/password.vo';

export class UserMapper {
  static toDomain(raw: UserOrmEntity): User {
    const user = new User(
      raw.id,
      raw.name,
      raw.email,
      new Password(raw.password),
    );
    return user;
  }

  static toPersistence(user: User): UserOrmEntity {
    const entity = new UserOrmEntity();
    entity.name = user['name'];
    entity.email = user['email'];
    entity.password = String(user['password'].getValue());
    return entity;
  }
}
