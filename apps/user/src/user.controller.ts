import { Body, Controller, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInputDto } from './dto/index.dto';
import { UnwantedAuthenticate } from '@app/common/decorator/unwanted-authenticate.decorator';
import {
  REGISTER_CAPTCHA_REDIS_KEY,
  SIGNIN_CAPTCHA_REDIS_KEY,
} from 'shared/constants';

@ApiTags('用户相关模块')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: '创建用户' })
  @ApiBody({ type: CreateUserDto })
  @Post('create')
  @HttpCode(201)
  @UnwantedAuthenticate()
  @MessagePattern('user:create')
  createUser(@Body() body: Prisma.UserCreateInput) {
    return this.userService.createUser(body);
  }

  @ApiOperation({ summary: '发送注册验证码' })
  @ApiBody({ type: CreateUserDto })
  @Post('send_register_captcha')
  @UnwantedAuthenticate()
  @MessagePattern('user:send_register_captcha')
  sendRegisterCaptcha(@Body() body: Prisma.UserCreateInput) {
    return this.userService.sendCaptcha(body, REGISTER_CAPTCHA_REDIS_KEY);
  }

  @ApiOperation({ summary: '发送登錄验证码' })
  @ApiBody({ type: CreateUserDto })
  @Post('send_signin_captcha')
  @UnwantedAuthenticate()
  @MessagePattern('user:send_signin_captcha')
  sendSigninCaptcha(@Body() body: Prisma.UserCreateInput) {
    return this.userService.sendCaptcha(body, SIGNIN_CAPTCHA_REDIS_KEY);
  }

  @ApiOperation({ summary: '根据 ID 查询用户' })
  @Patch('find_by_id/:id')
  @MessagePattern('user:find_by_id')
  async findById(@Param('id') id: any) {
    return this.userService.getUserWithWhere({ id });
  }

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: UserInputDto })
  @Post('signin')
  @UnwantedAuthenticate()
  @MessagePattern('user:signin')
  signin(@Body() body: UserInputDto) {
    return this.userService.signin(body);
  }

  @ApiOperation({ summary: '刷新令牌' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', description: '刷新令牌' },
        accessToken: { type: 'string', description: '访问令牌' },
      },
    },
  })
  @Post('refresh_token')
  @UnwantedAuthenticate()
  @MessagePattern('user:refresh_token')
  refreshToken(@Body() body: { refreshToken: string; accessToken: string }) {
    return this.userService.refreshToken(body);
  }
}
