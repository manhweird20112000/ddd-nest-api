import { DataSource } from 'typeorm';
import { RoleOrmEntity } from '../entities/role-orm.entity';
import { PermissionOrmEntity } from '../entities/permission-orm.entity';

export async function run(datasource: DataSource): Promise<void> {
  const repo = datasource.getRepository(RoleOrmEntity);
  const repoPermission = datasource.getRepository(PermissionOrmEntity);
  const permissions = await repoPermission.find();
  if (!permissions.length) {
    throw new Error('Permissions not found');
  }
  const role = repo.create({
    name: 'SUPER_ADMIN',
    description: 'Super admin role',
    is_default: 1,
    permissions,
  });
  await repo.save(role);
}
