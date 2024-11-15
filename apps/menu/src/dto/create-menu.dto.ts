import {
  IsString,
  IsOptional,
  IsInt,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { MenuType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty({ description: '父级菜单ID', required: false })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @ApiProperty({ description: '菜单名称' })
  @IsString()
  name: string;

  @ApiProperty({ description: '路由路径', required: false })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiProperty({ description: '组件路径', required: false })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiProperty({ description: '权限标识', required: false })
  @IsOptional()
  @IsString()
  permission?: string;

  @ApiProperty({ description: '菜单类型', enum: MenuType })
  @IsEnum(MenuType)
  type: MenuType;

  @ApiProperty({ description: '菜单图标', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: '显示顺序', required: false })
  @IsOptional()
  @IsInt()
  orderNum?: number;

  @ApiProperty({
    description: '菜单状态(true启用/false禁用)',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ description: '是否外链', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @ApiProperty({ description: '是否缓存', required: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCache?: boolean;

  @ApiProperty({ description: '是否显示', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;
}
