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
import { MINIO_CLIENT, REDIS_KEYS } from 'shared/constants';
import { ChangePasswordDto, UserInputDto } from './dto/index.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserDto } from './dto/update-user.dto';
import { Client } from 'minio';
import { FileService } from '@app/file';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(ConfigService)
  private readonly configService: ConfigService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject(FileService)
  private readonly fileService: FileService;

  async createUser(data: Prisma.UserCreateInput & { captcha?: string }) {
    const captcha = await this.redisService.get(
      REDIS_KEYS.REGISTER_CAPTCHA + `:${data.email}`,
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
        REDIS_KEYS.REGISTER_CAPTCHA + `:${data.email}`,
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
        address: this.configService.get('MAIL_USERNAME'),
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
      REDIS_KEYS.REGISTER_CAPTCHA + `:${email}`,
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

    this.redisService.del(REDIS_KEYS.SIGNIN_CAPTCHA + `:${email}`);

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

  async changePassword(data: ChangePasswordDto) {
    const { email, oldPassword, newPassword, captcha } = data;

    const storedCaptcha = await this.redisService.get(
      REDIS_KEYS.UPDATE_USER_PASSWORD + `:${email}`,
    );

    if (!storedCaptcha) {
      throw new BadRequestException('验证码已过期');
    }

    if (storedCaptcha !== captcha) {
      throw new BadRequestException('验证码错误');
    }

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 验证旧密码
    const isOldPasswordValid = compareSync(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new BadRequestException('旧密码错误');
    }

    const hashedNewPassword = hashSync(newPassword, 10);
    await this.prismaService.user.update({
      where: { email },
      data: { password: hashedNewPassword },
    });

    await this.redisService.del(REDIS_KEYS.UPDATE_USER_PASSWORD + `:${email}`);

    return true;
  }

  async updateUser(data: UpdateUserDto) {
    const { id, username, email, captcha, sex, avatar } = data;

    // 查找用户
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new BadRequestException('用户不存在');
    }

    // 验证用户名是否唯一
    if (username && username !== user.username) {
      const existingUserByUsername = await this.prismaService.user.findUnique({
        where: { username },
      });
      if (existingUserByUsername) {
        throw new BadRequestException('用户名已存在');
      }
    }

    // 验证邮箱是否唯一
    if (email && email !== user.email) {
      const existingUserByEmail = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (existingUserByEmail) {
        throw new BadRequestException('邮箱已存在');
      }
    }

    const storedCaptcha = await this.redisService.get(
      REDIS_KEYS.UPDATE_USER_DATA + `:${email}`,
    );

    if (!storedCaptcha) {
      throw new BadRequestException('验证码已过期');
    }

    if (storedCaptcha !== captcha) {
      throw new BadRequestException('验证码错误');
    }

    this.redisService.del(REDIS_KEYS.UPDATE_USER_DATA + `:${email}`);
    // 更新用户信息
    const updatedUser = await this.prismaService.user.update({
      where: { id },
      data: {
        username,
        email,
        avatar,
        sex,
        // 其他可更新的用户信息字段
      },
    });

    return updatedUser;
  }
}
