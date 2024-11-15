import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthInputDto } from './dto/index.dto';
import { Prisma } from '@prisma/client';
import { RedisService } from '@app/redis';
import { REDIS_KEYS } from 'shared/constants';
import { UnwantedAuthenticate } from '@app/common/decorator/unwanted-authenticate.decorator';
import { MessagePattern } from '@nestjs/microservices';

declare module 'express' {
  interface Request {
    user?: Partial<Prisma.UserCreateManyInput>;
  }
}

@ApiTags('认证相关模块')
@Controller('auth')
export class AuthController {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: AuthInputDto })
  @ApiResponse({
    status: 200,
    description: '登录成功',
  })
  @UnwantedAuthenticate()
  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(@Req() req: Request) {
    const { user } = req as Request & { user?: Prisma.UserCreateManyInput };
    const accessToken = this.authService.createAccessToken(user.id);
    const refreshToken = this.authService.createRefreshToken(user.id);

    delete user.password;
    this.redisService.del(REDIS_KEYS.SIGNIN_CAPTCHA + `:${user.email}`);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  @Get('signinWithGithub')
  @UseGuards(AuthGuard('github'))
  @UnwantedAuthenticate()
  async login() {}

  @Get('github/callback')
  @UnwantedAuthenticate()
  @UseGuards(AuthGuard('github'))
  async authCallback(@Req() req) {
    const { user } = req as Request & { user?: Prisma.UserCreateManyInput };
    const accessToken = this.authService.createAccessToken(user.id);
    const refreshToken = this.authService.createRefreshToken(user.id);

    delete user.password;
    return {
      user,
      accessToken,
      refreshToken,
    };
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
  @Post('refreshToken')
  @UnwantedAuthenticate()
  @MessagePattern('user:refresh_token')
  refreshToken(@Body() body: { refreshToken: string; accessToken: string }) {
    return this.authService.refreshToken(body);
  }
}
