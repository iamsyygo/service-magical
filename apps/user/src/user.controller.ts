import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('用户相关模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @Post('create')
  @MessagePattern('user:create')
  createUser(@Body() body: Prisma.UserCreateInput) {
    return this.userService.createUser(body);
  }

  @ApiOperation({ summary: '发送注册验证码' })
  @ApiBody({ type: CreateUserDto })
  @Post('send_register_captcha')
  @MessagePattern('user:send_register_captcha')
  sendRegisterCaptcha(@Body() body: Prisma.UserCreateInput) {
    return this.userService.sendRegisterCaptcha(body);
  }
}
