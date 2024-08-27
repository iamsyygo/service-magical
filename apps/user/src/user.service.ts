import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { hashSync } from 'bcryptjs';
import { REGISTER_CAPTCHA_REDIS_KEY } from 'shared/constants';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  redisService: RedisService;

  async createUser(data: Prisma.UserCreateInput & { captcha: string }) {
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
}
