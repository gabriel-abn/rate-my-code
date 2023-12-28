import IUserRepository from "@application/repositories/user-repository";
import { CheckEmailAvailability } from "@application/use-cases/sign-in-use-case";
import { User } from "@domain/entities";

export default class UserRepository implements IUserRepository, CheckEmailAvailability {
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
  async update(id: string, user: User): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id);

    this.users[index] = user;

    return user;
  }
}
