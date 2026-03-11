import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleOrmEntity } from './role-orm.entity';

@Entity('permissions')
export class RolePermissionOrmEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  resource: string;

  @Column()
  action: string;

  @Column()
  description: string;

  @ManyToMany(() => RoleOrmEntity, (role) => role.permissions)
  roles: RoleOrmEntity[];
}
