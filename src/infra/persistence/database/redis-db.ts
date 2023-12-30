import { Redis } from "ioredis";
import { KeyValueDatabase } from "../common";

export default class RedisDB implements KeyValueDatabase {
  private static instance: RedisDB;
  private client: Redis;

  private constructor() {
    this.client = new Redis({
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    });
  }

  async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  async get(key: string): Promise<string> {
    return await this.client.get(key);
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const exists = await this.client.exists(key);

    return exists <= 1;
  }

  public static getInstance(): RedisDB {
    if (!RedisDB.instance) {
      RedisDB.instance = new RedisDB();
    }

    return RedisDB.instance;
  }
}
