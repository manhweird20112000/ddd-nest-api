import { Field, ID, ObjectType } from '@nestjs/graphql';
import { PermissionType } from './permission.type';

/**
 * GraphQL representation of an admin role.
 */
@ObjectType('Role')
export class RoleType {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => [PermissionType], { nullable: true })
  permissions?: PermissionType[];
}
