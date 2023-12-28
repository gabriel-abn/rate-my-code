import { User } from "@domain/entities";

export default interface IUserRepository {
  save(user: User): Promise<string>;
  getById(id: string): Promise<User>;
  update(id: string, user: User): Promise<User>;
}
