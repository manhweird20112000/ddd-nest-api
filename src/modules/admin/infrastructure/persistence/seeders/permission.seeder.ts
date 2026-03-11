import { DataSource } from 'typeorm';
import { PermissionOrmEntity } from '../entities/permission-orm.entity';

export async function run(datasource: DataSource) {
  const repo = datasource.getRepository(PermissionOrmEntity);
  await repo.insert([
    {
      resource: 'admin',
      action: 'list',
      description: 'List admin',
    },
    {
      resource: 'admin',
      action: 'create',
      description: 'Create admin',
    },
    {
      resource: 'admin',
      action: 'update',
      description: 'Update admin',
    },
    {
      resource: 'admin',
      action: 'delete',
      description: 'Delete admin',
    },
  ]);
}
