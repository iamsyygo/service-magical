import { EmailService } from '@app/email';
import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { REGISTER_CAPTCHA_REDIS_KEY } from 'shared/constants';
import { md5 } from 'shared/utils/crypto.util';

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

  async createUser(data: Prisma.UserCreateInput & { captcha?: string }) {
    // console.log(this.configService.get);

    const captcha = await this.redisService.get(
      REGISTER_CAPTCHA_REDIS_KEY + `:${data.username}`,
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

    return this.prismaService.user.create({
      data,
      select: {
        id: true,
        username: true,
        email: true,
      },
    });
  }

  // 发送注册验证码
  async sendRegisterCaptcha(body: Prisma.UserCreateInput) {
    const { email, username } = body;
    // const captcha = md5(email + Date.now().toString());
    const captcha = Math.random().toString().slice(-6);

    await this.redisService.set(
      REGISTER_CAPTCHA_REDIS_KEY + `:${email}`,
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
}
