import { createClient, RedisClientType } from 'redis';

export const client: RedisClientType = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379,
  }
});
