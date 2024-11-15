import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { PrismaModule } from '@app/prisma';
import { CommonModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@app/redis';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, RedisModule, CommonModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
