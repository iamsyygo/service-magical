import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MicroserviceNames } from 'shared/enums/microservice-names.enum';
import { firstValueFrom } from 'rxjs';
import { RedisService } from '@app/redis';

@Injectable()
export class AppService {
  getHello(): string {
    return 'This is the root app';
  }

  @Inject(MicroserviceNames.USER)
  private userClient: ClientProxy;

  @Inject(RedisService)
  redisService: RedisService;

  async testUserMicroservice() {
    const value = await firstValueFrom(this.userClient.send('user', ''));

    this.redisService.set('user', value);

    const redisUser = await this.redisService.get('user');

    return redisUser;
  }
}
