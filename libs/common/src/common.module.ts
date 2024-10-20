import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './guard/auth.guard';
import { AppResponseInterceptor } from './interceptor/response.interceptor';
import { AppExceptionFilter } from './filter/exception.filter';

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
  providers: [
    CommonService,
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: AppResponseInterceptor },
    { provide: APP_FILTER, useClass: AppExceptionFilter },
  ],
  exports: [CommonService],
})
export class CommonModule {}
