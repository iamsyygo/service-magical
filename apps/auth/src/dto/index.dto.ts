import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class AuthInputDto {
  @ApiProperty({ description: '用户名', example: 'john_doe' })
  @IsString()
  username: string;

  @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  password: string;

  @ApiProperty({ description: '验证码', example: '' })
  @IsString()
  captcha: string;
}

// export class ChangePasswordDto {
//   @ApiProperty({ description: '邮箱', example: '2683030687@qq.com' })
//   @IsEmail()
//   email: string;

//   @ApiProperty({ description: '新密码', example: '123456' })
//   @IsString()
//   newPassword: string;

//   @ApiProperty({ description: '旧密码', example: '123456' })
//   @IsString()
//   oldPassword: string;

//   @ApiProperty({ description: '验证码', example: '' })
//   @IsString()
//   captcha: string;
// }
