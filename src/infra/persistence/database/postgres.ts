import { Pool } from "pg";
import { DatabaseError, RelationalDatabase } from "../common";

class Postgres implements RelationalDatabase {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
    });
  }

  async query(query: string, params?: any[]): Promise<any[]> {
    try {
      const client = await this.pool.connect();
      const result = await client.query(query, params);
      client.release();
      return result.rows;
    } catch (error) {
      throw new DatabaseError("Error executing query: " + error.message, error);
    }
  }

  async execute(query: string, params?: any[]): Promise<boolean> {
    try {
      const client = await this.pool.connect();
      await client.query(query, params);
      client.release();

      return true;
    } catch (error) {
      throw new DatabaseError("Error executing query: " + error.message, error);
    }
  }

  async close() {
    await this.pool.end();
  }
}

export default new Postgres(process.env.DATABASE_URL);
