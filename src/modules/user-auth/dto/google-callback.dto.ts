import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleCallbackDto {
  @IsString()
  @IsNotEmpty({ message: 'code is required' })
  code!: string;
}
