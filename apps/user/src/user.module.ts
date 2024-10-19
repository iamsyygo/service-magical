import { CommonModule } from '@app/common';
import { EmailModule } from '@app/email';
import { FileModule } from '@app/file';
import { PrismaModule } from '@app/prisma';
import { RedisModule } from '@app/redis';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    PrismaModule,
    RedisModule,
    EmailModule,
    CommonModule,
    FileModule,
  ],
  controllers: [UserController],
  // providers: [UserService, { provide: APP_GUARD, useClass: AuthGuard }],
  providers: [UserService],
})
export class UserModule {}
