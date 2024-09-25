import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_CLIENT } from 'shared/constants';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [
    ConfigService,
    RedisService,
    {
      inject: [ConfigService],
      provide: REDIS_CLIENT,
      async useFactory(configService) {
        const host = configService.get('REDIS_HOST');
        const port = configService.get('REDIS_PORT');
        const username = configService.get('REDIS_USERNAME');
        const password = configService.get('REDIS_PASSWORD');
        const client = createClient({
          socket: { host, port },
          username,
          password,
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
