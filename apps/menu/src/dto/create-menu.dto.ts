import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { MenuType } from '@prisma/client';

export class CreateMenuDto {
  @IsOptional()
  @IsInt()
  parentId?: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsString()
  component?: string;

  @IsOptional()
  @IsString()
  permission?: string;

  @IsEnum(MenuType)
  type: MenuType;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsInt()
  orderNum?: number;

  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @IsOptional()
  @IsBoolean()
  isCache?: boolean;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
