import { SaveVerificationToken } from "@application/use-cases/sign-in-use-case";
import { KeyValueDatabase } from "../common";
import RedisDB from "../database/redis-db";

class TokenRepository implements SaveVerificationToken {
  constructor(private kvDatabase: KeyValueDatabase) {}

  async saveToken(email: string, token: string): Promise<boolean> {
    try {
      await this.kvDatabase.set(email, token);
      return true;
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default new TokenRepository(RedisDB.getInstance());
