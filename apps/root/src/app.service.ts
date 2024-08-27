import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceNames } from 'shared/enums/microservice-names.enum';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '@app/redis';
import { Prisma } from '@prisma/client';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is the root app';
  }

  @Inject(MicroserviceNames.USER)
  private userClient: ClientProxy;

  @Inject(RedisService)
  redisService: RedisService;

  async createUser(body: Prisma.UserCreateArgs) {
    const value = await firstValueFrom(
      this.userClient.send('user:create', body),
    );
    return value;
  }
}
