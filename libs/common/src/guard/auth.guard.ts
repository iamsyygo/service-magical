import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { EXCLUDE_JWT_VERIFICATION } from 'shared/constants';

interface JwtUserData {
  id: number;
  username?: string;
  email?: string;
}

// declare module 'express' {
//   interface Request {
//     user: JwtUserData;
//   }
// }

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

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
      throw new UnauthorizedException('User is not logged in');
    }

    try {
      const accessToken = authorization.split(' ').pop();
      const data = this.jwtService.verify<JwtUserData>(accessToken);

      request.user = {
        id: data.id,
        username: data.username,
        email: data.email,
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
