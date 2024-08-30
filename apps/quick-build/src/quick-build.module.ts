import { Module } from '@nestjs/common';
import { QuickBuildController } from './quick-build.controller';
import { QuickBuildService } from './quick-build.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/prisma';
import { RedisModule } from '@app/redis';
import { CommonModule } from '@app/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@app/common/guard/auth.guard';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, RedisModule, CommonModule],
  controllers: [QuickBuildController],
  providers: [QuickBuildService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class QuickBuildModule {}
