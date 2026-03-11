import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdminOrmEntity } from './admin-orm.entity';
import { RolePermissionOrmEntity } from './permission-orm.entity';

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

  @ManyToMany(() => RolePermissionOrmEntity)
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: RolePermissionOrmEntity[];

  @Column({ type: 'smallint', default: 0 })
  is_default: number;
}
