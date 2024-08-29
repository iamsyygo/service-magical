import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '@app/prisma';
import { RedisModule } from '@app/redis';
import { EmailModule } from '@app/email';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@app/common/guard/auth.guard';
import { CommonModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    RedisModule,
    EmailModule,
    CommonModule,
    // JwtModule.registerAsync({
    //   inject: [ConfigService],
    //   imports: [ConfigModule],
    //   global: true,
    //   useFactory(configService: ConfigService) {
    //     const secret = configService.get('JWT_ACCESS_SECRET');
    //     return {
    //       secret,
    //       signOptions: {
    //         expiresIn: '30m', // 默认 30 分钟
    //       },
    //     };
    //   },
    // }),
  ],
  controllers: [UserController],
  providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class UserModule {}
