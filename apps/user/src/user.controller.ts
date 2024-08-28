import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInputDto } from './dto/index.dto';

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

  @ApiOperation({ summary: '根据 ID 查询用户' })
  @Patch('find_by_id/:id')
  @MessagePattern('user:find_by_id')
  async findById(@Param('id') id: any) {
    return this.userService.getUserWithWhere({ id });
  }

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: UserInputDto })
  @Post('login')
  @MessagePattern('user:login')
  login(@Body() body: UserInputDto) {
    return this.userService.signin(body);
  }
}
