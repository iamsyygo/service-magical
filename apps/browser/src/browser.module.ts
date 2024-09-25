import { Module } from '@nestjs/common';
import { BrowserController } from './browser.controller';
import { BrowserService } from './browser.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@app/prisma';
import { RedisModule } from '@app/redis';
import { CommonModule } from '@app/common';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, RedisModule, CommonModule],
  controllers: [BrowserController],
  providers: [BrowserService],
})
export class BrowserModule {}
