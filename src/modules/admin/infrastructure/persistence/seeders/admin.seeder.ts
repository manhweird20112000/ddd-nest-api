import { DataSource } from 'typeorm';
import { AdminOrmEntity } from '../entities/admin-orm.entity';
import { RoleOrmEntity } from '../entities/role-orm.entity';
import { PasswordVO } from '@/shared/domain';
import { EAdminStatus } from '@/modules/admin/domain';

export async function run(datasource: DataSource): Promise<void> {
  const repo = datasource.getRepository(AdminOrmEntity);
  const repoRole = datasource.getRepository(RoleOrmEntity);
  const superAdminRole = await repoRole.findOne({ where: { is_default: 1 } });
  if (!superAdminRole) {
    throw new Error('Super admin role not found');
  }
  const password = await PasswordVO.hash('123456');
  const admin = repo.create({
    name: 'Admin 1',
    email: 'superadmin@domain.com',
    password: password.getValue(),
    status: EAdminStatus.ACTIVE,
    roles: [superAdminRole],
  });
  await repo.save(admin);
}
