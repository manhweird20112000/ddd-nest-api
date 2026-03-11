import { IsArray, IsNotEmpty, IsNumber } from "class-validator";

export class CreateRoleDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @IsNumber({}, { each: true })
  permission_ids: number[];
}