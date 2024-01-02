import { CheckToken, SaveVerificationToken } from "@application/use-cases";
import { KeyValueDatabase } from "../common";
import RedisDB from "../database/redis-db";

class TokenRepository implements SaveVerificationToken, CheckToken {
  constructor(private kvDatabase: KeyValueDatabase) {}

  async saveToken(email: string, token: string): Promise<void> {
    await this.kvDatabase.set(email, token);
  }

  async checkToken(email: string, token: string): Promise<boolean> {
    const savedToken = await this.kvDatabase.get(email);

    if (savedToken !== token) {
      return false;
    }

    await this.kvDatabase.del(email);

    return true;
  }
  async checkEmail(email: string): Promise<boolean> {
    return await this.kvDatabase.exists(email);
  }
}

export default new TokenRepository(RedisDB.getInstance());
