import { User } from "@domain/entities";

export interface IUserRepository {
  save(user: User): Promise<string>;
  getById(id: string): Promise<User>;
  getByEmail(email: string): Promise<[User, boolean]>;
  update(id: string, user: User): Promise<boolean>;
}
