import { Field, InputType, Int } from '@nestjs/graphql';
import { CreateAdminDto } from '../../../application/dtos/create-admin.dto';

/**
 * GraphQL input for admin creation. Extends the REST DTO so the
 * class-validator rules stay defined in a single place.
 */
@InputType('CreateAdminInput')
export class CreateAdminInput extends CreateAdminDto {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [Int])
  role_ids: number[];
}
