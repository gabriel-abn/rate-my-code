import { User } from "@domain/entities";

export interface IUserRepository {
  save(user: User): Promise<string>;
  update(id: string, user: User): Promise<boolean>;
  get(filter: { username?: string; email?: string; id?: string }): Promise<User>;
}
