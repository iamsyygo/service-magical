import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local-strategy';
import { PrismaModule } from '@app/prisma';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@app/redis';
import { CommonModule } from '@app/common';

@Module({
  providers: [AuthService, LocalStrategy],
  imports: [ConfigModule.forRoot(), CommonModule, RedisModule, PrismaModule],
  exports: [AuthService],
})
export class AuthModule {}
