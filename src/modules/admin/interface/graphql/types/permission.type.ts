import { Field, ID, ObjectType } from '@nestjs/graphql';

/**
 * GraphQL representation of a permission (resource + action).
 */
@ObjectType('Permission')
export class PermissionType {
  @Field(() => ID)
  id: number;

  @Field()
  resource: string;

  @Field()
  action: string;

  @Field({ nullable: true })
  description?: string;
}
