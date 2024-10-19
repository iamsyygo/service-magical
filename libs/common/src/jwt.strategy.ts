import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * @deprecated 选择使用自定义的 AuthGuard 代替
 * @see auth.guard.ts
 */

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    const secret = configService.get('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = configService.get('JWT_ACCESS_TOKEN_EXPIRATION');
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
      expiresIn,
    });
  }

  async validate(payload: any) {
    // inject user info into request
    return { userId: payload.userId, username: payload.username };
  }
}
