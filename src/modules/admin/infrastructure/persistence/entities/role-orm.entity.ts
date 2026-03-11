import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminOrmEntity } from './admin-orm.entity';
import { PermissionOrmEntity } from './permission-orm.entity';

@Entity('roles')
export class RoleOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToMany(() => AdminOrmEntity, (admin) => admin.roles)
  admins: AdminOrmEntity[];

  @ManyToMany(() => PermissionOrmEntity)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionOrmEntity[];

  @Column({ type: 'smallint', default: 0 })
  is_default: number;
}
