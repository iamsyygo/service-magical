import { CommonModule } from '@app/common';
import { AuthGuard } from '@app/common/guard/auth.guard';
import { EmailModule } from '@app/email';
import { PrismaModule } from '@app/prisma';
import { RedisModule } from '@app/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    RedisModule,
    EmailModule,
    CommonModule,
  ],
  controllers: [UserController],
  providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class UserModule {}
