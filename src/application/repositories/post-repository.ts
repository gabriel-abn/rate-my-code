import { Post, PostProps } from "@domain/entities";

export interface IPostRepository {
  save(post: Post): Promise<void>;
  get(id: string): Promise<Post>;
  getAll(filter?: { tags?: string[]; userId?: string }): Promise<PostProps[]>;
  delete(id: string): Promise<void>;
  update(post: Post): Promise<void>;
  listTags(): Promise<string[]>;
}
