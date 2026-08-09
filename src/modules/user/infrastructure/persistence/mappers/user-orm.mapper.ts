import { User } from '@/modules/user/domain';
import { UserOrmEntity } from '../entities/user-orm.entity';

export class UserOrmMapper {
  toDomain(orm: UserOrmEntity): User {
    return new User(
      orm.id,
      orm.authUserId,
      orm.email,
      orm.displayName,
      orm.avatarUrl,
      orm.createdAt,
      orm.updatedAt,
      orm.deletedAt,
    );
  }

  toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id;
    orm.authUserId = domain.authUserId;
    orm.email = domain.email;
    orm.displayName = domain.displayName;
    orm.avatarUrl = domain.avatarUrl;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    orm.deletedAt = domain.deletedAt ?? null;
    return orm;
  }
}
