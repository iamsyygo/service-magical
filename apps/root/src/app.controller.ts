import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Prisma } from '@prisma/client';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from 'apps/user/src/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create')
  @ApiOperation({
    summary: '创建用户',
  })
  createUser(@Body() body: Prisma.UserCreateArgs) {
    return this.appService.createUser(body);
  }
}
