import { EmailService } from '@app/email';
import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { compareSync, hashSync } from 'bcryptjs';
import { REGISTER_CAPTCHA_REDIS_KEY } from 'shared/constants';
import { md5 } from 'shared/utils/crypto.util';
import { UserInputDto } from './dto/index.dto';

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

  getUserWithWhere(where: Prisma.UserFindUniqueArgs['where']) {
    return this.prismaService.user.findUnique({
      where,
    });
  }

  async signin(body: UserInputDto) {
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

    // 返回用户信息或生成 JWT 等
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }
}
