import { Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      global: true,
      useFactory(configService: ConfigService) {
        const secret = configService.get('JWT_ACCESS_SECRET');
        return {
          secret,
          signOptions: {
            expiresIn: '30m', // 默认 30 分钟
          },
        };
      },
    }),
  ],
  providers: [CommonService],
  exports: [CommonService],
})
export class CommonModule {}
