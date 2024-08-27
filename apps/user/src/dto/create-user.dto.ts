import { ApiProperty } from '@nestjs/swagger';
import { Sex } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsEmail } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsString()
  password: string;

  @ApiProperty({
    description: '头像URL',
    example: 'http://example.com/avatar.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiProperty({ description: '性别', enum: Sex, example: Sex.UNKNOWN })
  @IsEnum(Sex)
  sex: Sex;

  @ApiProperty({ description: '验证码' })
  captcha: string;
}
