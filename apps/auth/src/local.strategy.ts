/**
 * @name 用户名密码认证的策略
 */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { AuthInputDto } from './dto/index.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  // async validate(username: string, password: string) {
  //   const user = await this.authService.validateUser(username, password);
  //   return user;
  // }

  async validate(req: Request): Promise<any> {
    const authInputDto = req.body as unknown as AuthInputDto;
    const user = await this.authService.validateLocalUser(authInputDto);
    return user;
  }
}
