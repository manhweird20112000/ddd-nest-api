import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UserCreatedEventDto {
  @IsString()
  @MaxLength(128)
  authUserId: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  displayName?: string;
}
