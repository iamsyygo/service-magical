import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { PrismaModule } from '@app/prisma';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '@app/redis';
import { CommonModule } from '@app/common';

@Module({
  imports: [ConfigModule.forRoot(), PrismaModule, RedisModule, CommonModule],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}
