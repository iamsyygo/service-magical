import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_NAME } from 'shared/constants';

@Injectable()
export class RedisService {
  @Inject(REDIS_NAME)
  private redisClient: RedisClientType;

  /**
   * 根据pattern获取keys
   * @param pattern
   * @returns
   *
   * @example
   * keys('user:*')
   */
  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  /**
   * 获取key的值
   * @param key
   * @returns
   *
   * @example
   * get('user:1')
   */
  async get(key: string) {
    return await this.redisClient.get(key);
  }

  /**
   * 设置key的值
   * @param key
   * @param value
   * @param ttl 过期时间，单位秒
   *
   * @example
   * set('user:1', 'value', 60)
   */
  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  /**
   * 删除key
   * @param key
   *
   * @example
   * del('user:1')
   */
  async del(key: string) {
    await this.redisClient.del(key);
  }
}
