import { Post } from "@domain/entities";

export interface IPostRepository {
  save(post: Post): Promise<void>;
  get(id: string): Promise<Post>;
  getAll(): Promise<Post[]>;
  delete(id: string): Promise<void>;
  update(post: Post): Promise<void>;
}
