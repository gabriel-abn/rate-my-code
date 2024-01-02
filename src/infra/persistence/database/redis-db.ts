import { Redis } from "ioredis";
import { DatabaseError, KeyValueDatabase } from "../common";

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
    try {
      await this.client.set(key, value);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async get(key: string): Promise<string> {
    try {
      return await this.client.get(key);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async del(key?: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);

      if (exists <= 1) {
        return true;
      }

      return false;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }

  public static getInstance(): RedisDB {
    if (!RedisDB.instance) {
      RedisDB.instance = new RedisDB();
    }

    return RedisDB.instance;
  }
}
