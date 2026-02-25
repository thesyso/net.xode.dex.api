import { createClient, RedisClientType } from "redis";
// import config from "../configs/index.js";

import { moMessage } from "./modules/message.js";

class RedisService {
  private client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    const redisPassword = process.env.REDIS_DB_PASSWORD; // Get password from environment variables
    const redisHost = process.env.REDIS_DB_SERVER; // Get host from environment variables
    const redisPort = process.env.REDIS_DB_PORT ? parseInt(process.env.REDIS_DB_PORT) : 6379; // Get port from environment variables
    const redisDB = process.env.REDIS_DB_AGENT ? parseInt(process.env.REDIS_DB_AGENT) : 0; // Get db from environment variables

    if (!redisPassword) {
      moMessage('redis config warning', 'REDIS_DB_PASSWORD is not set in environment variables. Connection might fail without a password.', 'warn');
      // You might want to throw an error or handle this case more gracefully
      // For now, we'll proceed, but the connection might fail without a password.
    }

    // Provide a default empty string if password is not set
    this.client = createClient({
      url: `redis://:${redisPassword || ""}@${redisHost}:${redisPort}/${redisDB}` // Use values from config
    });

    this.client.on("error", (err) => moMessage('redis error', err, 'error'));
    this.client.on("connect", () => moMessage('redis connected', 'info'));
  }

  // 앱 시작 시 딱 한 번만 호출
  async init(redisDB ?: number) {
    if (!this.isConnected) {
      await this.client.connect();
      // 선택적으로 다른 DB로 전환 connect 후에 실행
      if (redisDB !== undefined) {
        await this.client.select(redisDB);
      }
      this.isConnected = true;
    }
  }

  // 데이터 제어 메서드들
  async setData(key: string, value: string, expiry?: number) {
    if (expiry) {
      await this.client.set(key, value, { EX: expiry });
    } else {
      await this.client.set(key, value);
    }
  }

  async getData(key: string) {
    return await this.client.get(key);
  }

  async setHashData(
    key: string,
    fieldValues: { [key: string]: string | number },
  ) {
    // hSet은 객체를 직접 전달받아 여러 필드를 한 번에 저장할 수 있습니다.
    await this.client.hSet(key, fieldValues);
  }

  async getHashData(key: string, field: string) {
    return await this.client.hGet(key, field);
  }

  async getAllHashData(key: string) {
    // 해당 키의 모든 필드와 값을 객체 형태로 반환합니다.
    return await this.client.hGetAll(key);
  }

  // 필요한 경우 원본 클라이언트 반환
  get rawClient() {
    return this.client;
  }
}

// 인스턴스를 단일화하여 export
export const redisService = new RedisService();
