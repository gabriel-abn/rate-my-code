import { Redis } from "ioredis";
import { DatabaseError, KeyValueDatabase, ListDatabase } from "../common";

class RedisDB implements KeyValueDatabase, ListDatabase {
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
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async get(key: string): Promise<string> {
    try {
      return await this.client.get(key);
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async del(key?: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async deleteAll(): Promise<void> {
    try {
      await this.client.flushall();
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
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
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async getList(listName: string): Promise<string[]> {
    try {
      return await this.client.lrange("list:" + listName, 0, -1);
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async addToList(listName: string, ...value: string[]): Promise<void> {
    try {
      await this.client.lpush("list:" + listName, ...value);
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async getLists(pattern?: string): Promise<string[]> {
    try {
      if (pattern) {
        return await this.client.keys("list:" + pattern);
      }

      return await this.client.keys("list:*");
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async removeFromList(listName: string, ...value: string[]): Promise<void> {
    try {
      value.forEach(async (val: string) => {
        await this.client.lrem("list:" + listName, 0, val);
      });
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  async deleteList(listName: string): Promise<void> {
    try {
      await this.client.del("list:" + listName);
    } catch (err) {
      throw new DatabaseError("Redis error: " + err.message);
    }
  }

  public static getInstance(): RedisDB {
    if (!RedisDB.instance) {
      RedisDB.instance = new RedisDB();
    }

    return RedisDB.instance;
  }
}

export default RedisDB.getInstance();
