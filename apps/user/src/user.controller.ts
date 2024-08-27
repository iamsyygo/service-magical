import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { Prisma } from '@prisma/client';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('user:create')
  createUser(body: Prisma.UserCreateInput) {
    console.log(body);
    return this.userService.createUser(body);
  }
}
