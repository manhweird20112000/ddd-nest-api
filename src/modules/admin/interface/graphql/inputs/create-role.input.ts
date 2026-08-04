import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateRoleDto } from '../../../application/dtos/create-role.dto';

/**
 * GraphQL input for role creation. Extends the REST DTO so the
 * class-validator rules stay defined in a single place.
 */
@InputType('CreateRoleInput')
export class CreateRoleInput extends CreateRoleDto {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(() => [Int])
  permission_ids: number[];
}
