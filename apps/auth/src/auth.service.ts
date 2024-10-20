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
import { ProfileType } from './types/github';
import { Provider } from '@prisma/client';

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

    let captchaLoginEnabled = true;

    try {
      captchaLoginEnabled = JSON.parse(
        this.configService.get('REQUIRE_CAPTCHA_LOGIN'),
      );
    } catch (error) {}

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
      throw new BadRequestException('User not found');
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Password is invalid');
    }
    return user;
  }

  // 生成 Access Token
  createAccessToken(userId: number): string {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_ACCESS_TOKEN_SECRET');
    const expiresIn = this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION');

    return 'Bearer ' + this.jwtService.sign(payload, { secret, expiresIn });
  }

  // 生成刷新 Token
  createRefreshToken(userId: number): string {
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

  async validateGithubUser(profile: ProfileType) {
    const { id, username } = profile;
    const userProvider = await this.prismaService.userProvider.findFirst({
      where: {
        providerId: id,
        provider: Provider.GITHUB,
      },
      // 表示同时查询 user 表中的数据
      // include: {
      //   user: true,
      // },
    });

    if (!userProvider) {
      // 使用github登录时，如果用户不存在自动创建用户

      const _profileJson = JSON.parse(
        JSON.stringify(profile._json),
      ) as ProfileType['_json'];

      const newUser = await this.prismaService.user.create({
        data: {
          username: username,
          email: _profileJson.email || '',
          password: '',
          avatar: _profileJson.avatar_url,
        },
      });

      const newUserProvider = await this.prismaService.userProvider.create({
        data: {
          userId: newUser.id,
          provider: Provider.GITHUB,
          providerId: id,
          callbackData: JSON.stringify(profile),
        },
      });
      return newUser;
    } else {
      const existUser = await this.prismaService.user.findUnique({
        where: {
          id: userProvider.userId,
        },
      });

      return existUser;
    }
  }
}
