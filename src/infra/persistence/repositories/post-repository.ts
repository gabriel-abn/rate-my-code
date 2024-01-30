import { IPostRepository } from "@application/repositories";
import { Post, PostProps } from "@domain/entities";
import { DatabaseError, ListDatabase, RelationalDatabase } from "../common";
import postgres from "../database/postgres";
import redisDb from "../database/redis-db";

class PostRepository implements IPostRepository {
  constructor(
    private readonly relational: RelationalDatabase,
    private readonly list: ListDatabase,
  ) {}

  async save(post: Post): Promise<void> {
    try {
      await this.relational
        .execute(
          `
          INSERT INTO public.post (id, title, content, user_id)
          VALUES ($1, $2, $3, $4);
        `,
          [post.id, post.title, post.content, post.userId],
        )
        .then(async () => {
          await this.list.addToList("tags", ...post.tags);

          Promise.all(
            post.tags.map(async (tag) => {
              await this.list.addToList(`tag:${tag}`, post.id);
            }),
          );
        });
    } catch (error) {
      throw new DatabaseError("Error saving post", error);
    }
  }

  async get(id: string): Promise<Post> {
    try {
      const postProps = await this.relational
        .query(
          `
            SELECT user_id as "userId", * 
            FROM public.post 
            WHERE id = $1;
          `,
          [id],
        )
        .then(async (rows) => {
          if (rows.length === 0) {
            throw new DatabaseError("Post not found");
          }

          const tags = await this.list.getList(`post:${id}`);

          return { ...rows[0], tags };
        });

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
        const postsIds = new Set<string>();

        await Promise.all(
          tags.map(async (tag) => {
            const ids = await this.list.getList(`tag:${tag}`);

            ids.forEach((id) => postsIds.add(id));
          }),
        );

        posts = await Promise.all(
          Array.from(postsIds).map(async (id) => {
            const post = await this.get(id);

            return post;
          }),
        );

        return posts;
      }

      posts = await this.relational
        .query(
          `
            SELECT * FROM public.post;
          `,
        )
        .then((rows) =>
          rows.map(async (row) => ({
            ...row,
            tags: await this.list.getList(`post:${row.id}`),
          })),
        );

      return posts;
    } catch (error) {
      throw new DatabaseError("Error getting all posts " + error.name, error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.relational.execute(
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
      await this.relational.execute(
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

  async listTags(): Promise<string[]> {
    try {
      const tags = (await this.list.getLists("tags:*")).map((tag) => tag.split(":")[-1]);

      return tags;
    } catch (error) {
      throw new DatabaseError("Error listing tags", error);
    }
  }
}

export default new PostRepository(postgres, redisDb);
