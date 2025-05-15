import { DataSource } from 'typeorm';
import { UserOrmEntity } from '@/modules/user/infra/database/typeorm/entities/user-orm.entity';

export async function run(datasource: DataSource) {
  const repo = datasource.getRepository(UserOrmEntity);
  await repo.insert({
    name: 'User 1',
  });

  console.log('✅ Seeded user');
}
