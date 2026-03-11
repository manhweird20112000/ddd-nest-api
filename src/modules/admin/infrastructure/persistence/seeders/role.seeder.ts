import { DataSource } from 'typeorm';
import { RoleOrmEntity } from '../entities/role-orm.entity';

export async function run(datasource: DataSource) {
  const repo = datasource.getRepository(RoleOrmEntity);
  await repo.insert([
    {
      name: 'SUPER_ADMIN',
      description: 'Super admin role',
      is_default: 1,
    },
  ]);
}
