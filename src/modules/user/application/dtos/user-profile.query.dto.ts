import { IsUUID } from 'class-validator';

export class UserProfileQueryDto {
  @IsUUID('4')
  userId: string;
}
