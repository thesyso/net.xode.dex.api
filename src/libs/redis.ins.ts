import { createClient, RedisClientType } from "redis";

class RedisService {
  private clients: { [key: number]: RedisClientType } = {};

  async getClient(db: number = 0): Promise<RedisClientType> {
    if (!this.clients[db]) {
      const redisPassword = process.env.REDIS_DB_PASSWORD;
      const redisHost = process.env.REDIS_DB_SERVER;
      const redisPort = process.env.REDIS_DB_PORT || 6379;

      const client = createClient({
        url: `redis://:${redisPassword}@${redisHost}:${redisPort}/${db}`
      });

      await client.connect();
      this.clients[db] = client as RedisClientType;
    }
    return this.clients[db];
  }
}

export const redisService = new RedisService();