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

          await this.list.addToList(`post:${post.id}`, ...post.tags);
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
            SELECT p.*, p.user_id AS "userId"
            FROM public.post p
            WHERE p.id = $1;
          `,
          [id],
        )
        .then((rows: any[]) => {
          if (!rows) {
            throw new DatabaseError("Post not found");
          }

          return { ...rows[0] };
        })
        .catch((err) => {
          throw new DatabaseError("Post not found: " + err.message);
        });

      const tags = await this.list.getList(`post:${id}`);

      const post = Post.restore({ ...postProps, tags }, id);

      return post;
    } catch (error) {
      throw new DatabaseError("Error getting post", error);
    }
  }

  async getAll(filter?: { tags: string[]; userId: string }): Promise<PostProps[]> {
    try {
      let posts: any[];

      if (filter?.tags) {
        const { tags } = filter;
        const postsIds = new Set<string>();

        for (const tag of tags) {
          const ids = await this.list.getList(`tag:${tag}`);
          ids.forEach((id) => postsIds.add(id));
        }

        const postsRows = await this.relational.query(
          `
            SELECT *, user_id AS "userId"
            FROM public.post 
            WHERE id = ANY($1)
            ORDER BY created_at DESC;
          `,
          [Array.from(postsIds)],
        );

        posts = await Promise.all(
          postsRows.map(async (row) => ({
            ...row,
            tags: await this.list.getList(`post:${row.id}`),
          })),
        );

        return posts;
      }

      if (filter?.userId) {
        const postsRows = await this.relational.query(
          `
              SELECT *, user_id AS "userId"
              FROM public.post
              WHERE user_id = $1
              ORDER BY created_at DESC;
            `,
          [filter.userId],
        );

        posts = await Promise.all(
          postsRows.map(async (row) => ({
            ...row,
            tags: await this.list.getList(`post:${row.id}`),
          })),
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
      const tags = await this.list.getLists("tag:*");

      return tags.map((tag) => tag.split(":")[2]);
    } catch (error) {
      throw new DatabaseError("Error listing tags", error);
    }
  }

  async mostUsedTags(): Promise<string[]> {
    try {
      const tags = await this.listTags();

      const tagsWithCount = await Promise.all(
        tags.map(async (tag) => ({
          tag,
          count: await this.list.listSize(`tag:${tag}`),
        })),
      );

      tagsWithCount.sort((a, b) => b.count - a.count);

      return tagsWithCount.map((tag) => tag.tag);
    } catch (error) {
      throw new DatabaseError("Error getting most used tags: " + error.message, error);
    }
  }
}

export default new PostRepository(postgres, redisDb);
