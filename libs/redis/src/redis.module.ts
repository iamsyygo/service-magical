import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_NAME } from 'shared/constants';
import { createClient } from 'redis';

@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_NAME,
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
          username: 'default',
          password: '123456',
        });
        await client.connect();
        return client;
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
