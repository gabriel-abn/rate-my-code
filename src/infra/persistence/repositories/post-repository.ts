import { IPostRepository } from "@application/repositories";
import { Post } from "@domain/entities";
import { DatabaseError, RelationalDatabase } from "../common";
import postgres from "../database/postgres";

class PostRepository implements IPostRepository {
  constructor(private readonly database: RelationalDatabase) {}

  async save(post: Post): Promise<void> {
    try {
      await this.database.execute(
        `
          INSERT INTO posts (id, title, content, user_id)
          VALUES ($1, $2, $3, $4, $5);
        `,
        [post.id, post.title, post.content, post.userId],
      );
    } catch (error) {
      throw new DatabaseError("Error saving post", error);
    }
  }

  async get(id: string): Promise<Post> {
    try {
      const postProps = await this.database
        .query(
          `
            SELECT * FROM posts WHERE id = $1;
          `,
          [id],
        )
        .then((rows) => rows[0]);

      const post = Post.restore(postProps, id);

      return post;
    } catch (error) {
      throw new DatabaseError("Error getting post", error);
    }
  }

  async getAll(): Promise<Post[]> {
    try {
      const posts = await this.database
        .query(
          `
            SELECT * FROM posts;
          `,
        )
        .then((rows) => rows.map((row) => Post.restore(row, row.id)));

      return posts;
    } catch (error) {
      throw new DatabaseError("Error getting all posts", error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.database.execute(
        `
          DELETE FROM posts WHERE id = $1;
        `,
        [id],
      );
    } catch (error) {
      throw new DatabaseError("Error deleting post", error);
    }
  }

  async update(post: Post): Promise<void> {
    try {
      await this.database.execute(
        `
          UPDATE posts
          SET title = $1, content = $2
          WHERE id = $3;
        `,
        [post.title, post.content, post.id],
      );
    } catch (error) {
      throw new DatabaseError("Error updating post", error);
    }
  }
}

export default new PostRepository(postgres);
