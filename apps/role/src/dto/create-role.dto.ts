import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  code: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsString()
  @IsOptional()
  remark?: string;

  @IsArray()
  @IsOptional()
  menuIds?: number[];
}
