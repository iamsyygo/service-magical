import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthInputDto } from './dto/index.dto';

@ApiTags('认证相关模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '登录' })
  @ApiBody({ type: AuthInputDto })
  @Post('signin')
  @UseGuards(AuthGuard('local'))
  async signin(@Req() req: Request) {
    return 'signin';
  }
}
