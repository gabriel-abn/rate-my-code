import IUserRepository from "@application/repositories/user-repository";
import { CheckEmailAvailability } from "@application/use-cases";
import { User } from "@domain/entities";

export default class UserRepositorySpy
  implements IUserRepository, CheckEmailAvailability
{
  users: User[];

  constructor() {
    this.users = [
      new User(
        {
          email: "fake@gmail.com",
          password: "fake",
        },
        "fake",
      ),
    ];
  }

  async getByEmail(email: string): Promise<[User, boolean]> {
    const user = this.users.find((user) => user.email === email);

    if (user) {
      return [user, true];
    }

    return [null, false];
  }

  async checkEmail(email: string): Promise<boolean> {
    const user = this.users.find((user) => user.email === email);

    if (user) {
      return true;
    }

    return false;
  }

  async save(user: User): Promise<string> {
    this.users.push(user);

    return user.id;
  }

  async getById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }

  async update(id: string, user: User): Promise<boolean> {
    const index = this.users.findIndex((user) => user.id === id);

    this.users[index] = user;

    return true;
  }
}
