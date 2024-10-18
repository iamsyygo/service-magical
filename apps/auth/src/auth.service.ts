import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { compareSync } from 'bcryptjs';
import { REDIS_KEYS } from 'shared/constants';
import { AuthInputDto } from './dto/index.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  // 账号和密码验证策略
  async validateLocalUser(authInputDto: AuthInputDto) {
    const { email, username, password, captcha } = authInputDto;
    if (!email && !username) {
      throw new BadRequestException('Email or username is required');
    }

    if (!password) {
      throw new BadRequestException('Password is required');
    }

    const captchaLoginEnabled = this.configService.get(
      'REQUIRE_CAPTCHA_LOGIN',
      true,
    );

    if (!captcha && captchaLoginEnabled) {
      throw new BadRequestException('Captcha is required');
    }

    if (captchaLoginEnabled) {
      const storedCaptcha = await this.redisService.get(
        REDIS_KEYS.REGISTER_CAPTCHA + `:${email}`,
      );

      if (!storedCaptcha) {
        throw new BadRequestException('Captcha is expired');
      }

      if (storedCaptcha !== captcha) {
        throw new BadRequestException('Captcha is invalid');
      }
    }
    const user = await this.prismaService.user.findUnique({
      where: {
        email: email,
        username: username,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is invalid');
    }
    return user;
  }

  // 生成 Access Token
  private createAccessToken(userId: number): string {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION');

    return 'Bearer ' + this.jwtService.sign(payload, { secret, expiresIn });
  }

  // 生成刷新 Token
  private createRefreshToken(userId: number): string {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_REFRESH_TOKEN_SECRET');
    const expiresIn = this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION');

    return 'Bearer ' + this.jwtService.sign(payload, { secret, expiresIn });
  }

  // 刷新令牌
  async refreshToken(body: { accessToken: string; refreshToken: string }) {
    let { accessToken = '', refreshToken = '' } = body;
    accessToken = accessToken.split(' ').pop();
    refreshToken = refreshToken.split(' ').pop();
    // 解码 Access Token 以确保它是由系统生成的
    const decodedAccessToken = this.jwtService.decode(accessToken);
    if (!decodedAccessToken) {
      throw new UnauthorizedException('无效的 Access Token');
    }
    try {
      // 验证刷新 Token
      const decodedRefreshToken = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });

      // 生成新的 Access Token
      const newAccessToken = this.createAccessToken(decodedRefreshToken.sub);

      // 生成新的 Refresh Token，如果账号7天内活跃，可以无限续期
      const newRefreshToken = this.createRefreshToken(decodedRefreshToken.sub);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('无效的 Refresh Token');
    }
  }

  // async changePassword(data: ChangePasswordDto) {
  //   const { email, oldPassword, newPassword, captcha } = data;

  //   const storedCaptcha = await this.redisService.get(
  //     REDIS_KEYS.UPDATE_USER_PASSWORD + `:${email}`,
  //   );

  //   if (!storedCaptcha) {
  //     throw new BadRequestException('验证码已过期');
  //   }

  //   if (storedCaptcha !== captcha) {
  //     throw new BadRequestException('验证码错误');
  //   }

  //   const user = await this.prismaService.user.findUnique({
  //     where: { email },
  //   });

  //   if (!user) {
  //     throw new BadRequestException('用户不存在');
  //   }

  //   // 验证旧密码
  //   const isOldPasswordValid = compareSync(oldPassword, user.password);
  //   if (!isOldPasswordValid) {
  //     throw new BadRequestException('旧密码错误');
  //   }

  //   const hashedNewPassword = hashSync(newPassword, 10);
  //   await this.prismaService.user.update({
  //     where: { email },
  //     data: { password: hashedNewPassword },
  //   });

  //   await this.redisService.del(REDIS_KEYS.UPDATE_USER_PASSWORD + `:${email}`);

  //   return true;
  // }
}
