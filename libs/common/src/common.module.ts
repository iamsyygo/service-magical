import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      global: true,
      useFactory(configService: ConfigService) {
        const secret = configService.get('JWT_ACCESS_TOKEN_SECRET');
        return {
          secret,
          signOptions: {
            expiresIn: '30m', // 默认 30 分钟
          },
        };
      },
    }),
  ],
  providers: [CommonService, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [CommonService],
})
export class CommonModule {}
