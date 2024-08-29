import { ApiProperty } from '@nestjs/swagger';
import { Sex } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsEmail,
  IsNotEmpty,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'id' })
  @IsNotEmpty()
  id: any;

  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '头像URL',
    example: 'https://picsum.photos/200',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '性别', enum: Sex, example: Sex.UNKNOWN })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({ description: '验证码', example: '' })
  captcha: string;
}
