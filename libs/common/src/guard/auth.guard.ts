import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { EXCLUDE_JWT_VERIFICATION } from 'shared/constants';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const unwantedAuthenticate = this.reflector.getAllAndOverride(
      EXCLUDE_JWT_VERIFICATION,
      [context.getClass(), context.getHandler()],
    );
    if (unwantedAuthenticate) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const accessToken = authorization.split(' ').pop();
      const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
      const data = this.jwtService.verify<{
        sub: number;
        iat: number;
        exp: number;
      }>(accessToken, {
        secret,
      });

      request.user = {
        id: data.sub,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('无效的令牌');
    }
  }
}
