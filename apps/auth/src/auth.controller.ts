import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthInputDto } from './dto/index.dto';
import { Prisma } from '@prisma/client';
import { RedisService } from '@app/redis';
import { REDIS_KEYS } from 'shared/constants';

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
  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(@Req() req: Request) {
    const { user } = req as Request & { user?: Prisma.UserCreateManyInput };
    const accessToken = this.authService.createAccessToken(user.id);
    const refreshToken = this.authService.createRefreshToken(user.id);

    delete user.password;

    this.redisService.del(REDIS_KEYS.SIGNIN_CAPTCHA + `:${user.email}`);

    // 返回用户信息、生成 JWT 等
    return {
      user,
      accessToken,
      refreshToken,
    };
  }
}
