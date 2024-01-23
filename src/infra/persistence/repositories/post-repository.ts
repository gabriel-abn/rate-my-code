import { IPostRepository } from "@application/repositories";
import { Post, PostProps } from "@domain/entities";
import { DatabaseError, RelationalDatabase } from "../common";
import postgres from "../database/postgres";

class PostRepository implements IPostRepository {
  constructor(private readonly database: RelationalDatabase) {}

  async save(post: Post): Promise<void> {
    try {
      await this.database.execute(
        `
          INSERT INTO public.post (id, title, content, tags, user_id)
          VALUES ($1, $2, $3, $4, $5);
        `,
        [post.id, post.title, post.content, post.tags, post.userId],
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
            SELECT user_id as "userId", * 
            FROM public.post 
            WHERE id = $1;
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

  async getAll(filter?: { tags: string[] }): Promise<PostProps[]> {
    try {
      let posts: any[];

      if (filter?.tags) {
        const { tags } = filter;

        posts = await this.database
          .query(
            `
              SELECT *
              FROM public.posts_view p
              WHERE ${
                tags.length > 1 ? "p.tags && $1::character varying[]" : "$1 = ANY(p.tags)"
              }
            `,
            [tags.length > 1 ? tags : tags[0]],
          )
          .then((rows) => rows.map((row) => row))
          .catch((error) => {
            throw new DatabaseError("Error getting all posts: " + error.message, error);
          });

        return posts;
      }

      posts = await this.database
        .query(
          `
            SELECT * FROM public.post;
          `,
        )
        .then((rows) => rows.map((row) => Post.restore(row, row.id)));

      return posts;
    } catch (error) {
      throw new DatabaseError("Error getting all posts " + error.name, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.database.execute(
        `
          DELETE FROM public.posts WHERE id = $1;
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
          UPDATE public.post
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
