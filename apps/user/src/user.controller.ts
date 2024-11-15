import { UnwantedAuthenticate } from '@app/common/decorator/unwanted-authenticate.decorator';
import { Body, Controller, HttpCode, Param, Patch, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { REDIS_KEYS } from 'shared/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { ChangePasswordDto, UserInputDto } from './dto/index.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

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
  @Post('sendRegisterCaptcha')
  @UnwantedAuthenticate()
  @MessagePattern('user:send_register_captcha')
  sendRegisterCaptcha(@Body() body: Prisma.UserCreateInput) {
    return this.userService.sendCaptcha(body, REDIS_KEYS.REGISTER_CAPTCHA);
  }

  @ApiOperation({ summary: '发送登录证码' })
  @ApiBody({ type: CreateUserDto })
  @Post('sendSigninCaptcha')
  @UnwantedAuthenticate()
  @MessagePattern('user:send_signin_captcha')
  sendSigninCaptcha(@Body() body: Prisma.UserCreateInput) {
    return this.userService.sendCaptcha(body, REDIS_KEYS.SIGNIN_CAPTCHA);
  }

  @ApiOperation({ summary: '发送修改密码证码' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', description: '邮箱' },
      },
    },
  })
  @Post('sendUpdatePasswordCaptcha')
  @MessagePattern('user:sent_update_password_captcha')
  sendUpdatePasswordCaptcha(@Body() body: Prisma.UserCreateInput) {
    return this.userService.sendCaptcha(body, REDIS_KEYS.UPDATE_USER_PASSWORD);
  }

  @ApiOperation({ summary: '根据 ID 查询用户' })
  @Patch('findById/:id')
  @MessagePattern('user:find_by_id')
  async findById(@Param('id') id: any) {
    return this.userService.getUserWithWhere({ id });
  }

  @ApiOperation({ summary: '登录', deprecated: true })
  @ApiBody({ type: UserInputDto })
  @Post('signin')
  @UnwantedAuthenticate()
  @MessagePattern('user:signin')
  signin(@Body() body: UserInputDto) {
    return this.userService.signin(body);
  }

  @ApiOperation({ summary: '刷新令牌', deprecated: true })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: { type: 'string', description: '刷新令牌' },
        accessToken: { type: 'string', description: '访问令牌' },
      },
    },
  })
  @Post('refreshToken')
  @UnwantedAuthenticate()
  @MessagePattern('user:refresh_token')
  refreshToken(@Body() body: { refreshToken: string; accessToken: string }) {
    return this.userService.refreshToken(body);
  }

  @ApiOperation({ summary: '修改密码' })
  @ApiBody({ type: ChangePasswordDto })
  @Post('changePassword')
  @MessagePattern('user:change_password')
  changePassword(@Body() body: ChangePasswordDto) {
    return this.userService.changePassword(body);
  }

  @ApiOperation({ summary: '修改用户信息' })
  @Post('update')
  @MessagePattern('user:update')
  @UnwantedAuthenticate()
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }
}
