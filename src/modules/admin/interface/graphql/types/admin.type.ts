import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { EAdminStatus } from '../../../domain/enums/admin-status.enum';
import { RoleType } from './role.type';

registerEnumType(EAdminStatus, { name: 'AdminStatus' });

/**
 * GraphQL representation of an admin. Never exposes the password hash.
 */
@ObjectType('Admin')
export class AdminType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => EAdminStatus)
  status: EAdminStatus;

  @Field(() => Int, { nullable: true })
  createdBy?: number;

  @Field(() => Int, { nullable: true })
  deletedBy?: number;

  @Field(() => [RoleType], { nullable: true })
  roles?: RoleType[];

  @Field(() => Date, { nullable: true })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  updatedAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;
}
