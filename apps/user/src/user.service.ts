import { EmailService } from '@app/email';
import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { compareSync, hashSync } from 'bcryptjs';
import {
  REGISTER_CAPTCHA_REDIS_KEY,
  SIGNIN_CAPTCHA_REDIS_KEY,
} from 'shared/constants';
import { UserInputDto } from './dto/index.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  redisService: RedisService;

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject(JwtService)
  private jwtService: JwtService;
  // constructor(private jwtService: JwtService) {}

  async createUser(data: Prisma.UserCreateInput & { captcha?: string }) {
    const captcha = await this.redisService.get(
      REGISTER_CAPTCHA_REDIS_KEY + `:${data.email}`,
    );

    if (!captcha) {
      return new BadRequestException('验证码已过期');
    }
    if (captcha !== data.captcha) {
      return new BadRequestException('验证码错误');
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        username: data.username,
        email: data.email,
      },
    });

    if (user) {
      return new BadRequestException('用户已存在');
    }

    delete data.captcha;

    const password = hashSync(data.password, 10);
    data.password = password;

    const result = await this.prismaService.user.create({
      data,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });

    if (result) {
      await this.redisService.del(
        REGISTER_CAPTCHA_REDIS_KEY + `:${data.email}`,
      );
      return result;
    }

    return false;
  }

  // 发送验证码
  async sendCaptcha(body: Prisma.UserCreateInput, redisKey: string) {
    const { email, username } = body;
    // const captcha = md5(email + Date.now().toString());
    const captcha = Math.random().toString().slice(-6);

    await this.redisService.set(
      redisKey + `:${email}`,
      captcha,
      60 * 5, // 5 min
    );

    return await this.emailService.sendMail({
      from: {
        name: this.configService.get('APP_NAME'),
        address: this.configService.get('EMAIL_USER'),
      },
      to: email,
      subject: '注册验证码',
      html: `<h1>${username}，您的注册验证码是：${captcha}</h1>`,
    });
  }

  getUserWithWhere(where: Prisma.UserFindUniqueArgs['where']) {
    return this.prismaService.user.findUnique({
      where,
    });
  }

  async signin(body: UserInputDto) {
    console.log(body);
    const { email, username, password, captcha } = body;

    if (!email && !username) {
      throw new BadRequestException('邮箱或用户名不能为空');
    }

    if (!password) {
      throw new BadRequestException('密码不能为空');
    }

    if (!captcha) {
      throw new BadRequestException('验证码不能为空');
    }

    const storedCaptcha = await this.redisService.get(
      REGISTER_CAPTCHA_REDIS_KEY + `:${email}`,
    );

    if (!storedCaptcha) {
      throw new BadRequestException('验证码已过期');
    }

    if (storedCaptcha !== captcha) {
      throw new BadRequestException('验证码错误');
    }

    const user = await this.getUserWithWhere({
      email: email,
      username: username,
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    const isPasswordValid = compareSync(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('密码错误');
    }

    const accessToken = this.createAccessToken(user.id);
    const refreshToken = this.createRefreshToken(user.id);

    delete user.password;

    this.redisService.del(SIGNIN_CAPTCHA_REDIS_KEY + `:${email}`);

    // 返回用户信息、生成 JWT 等
    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  // 生成 Access Token
  private createAccessToken(userId: number): string {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get('JWT_ACCESS_EXPIRES_IN');

    return 'Bearer ' + this.jwtService.sign(payload, { secret, expiresIn });
  }

  // 生成刷新 Token
  private createRefreshToken(userId: number): string {
    const payload = { sub: userId };
    const secret = this.configService.get('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get('JWT_REFRESH_EXPIRES_IN');

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
        secret: this.configService.get('JWT_REFRESH_SECRET'),
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
}
