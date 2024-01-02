import IUserRepository from "@application/repositories/user-repository";
import { CheckEmailAvailability, CheckUserEmail } from "@application/use-cases";
import { User } from "@domain/entities";
import { PrismaClient } from "@prisma/client";
import { RelationalDatabase } from "../common";
import postgres from "../database/postgres";
import prisma from "../database/prisma";

class UserRepository implements IUserRepository, CheckEmailAvailability, CheckUserEmail {
  constructor(
    private database: RelationalDatabase,
    private prisma: PrismaClient,
  ) {}

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.database
      .query(
        `
          SELECT  "id"
          FROM    "User"
          WHERE   "email" = $1;
        `,
        [email],
      )
      .then((rows) => rows[0]);

    if (user) {
      return true;
    }

    return false;
  }

  async verifyEmail(email: string): Promise<void> {
    await this.database.query(
      `
          UPDATE  "User"
          SET     "emailVerified" = true
          WHERE   "email" = $1;
        `,
      [email],
    );
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.database
      .query(
        `
          SELECT  "id", "email", "password"
          FROM    "User"
          WHERE   "email" = $1;
        `,
        [email],
      )
      .then((rows) => rows[0]);

    if (!user) {
      return null;
    }

    return User.restore(user, user.id);
  }

  async save(user: User): Promise<string> {
    const { id } = await this.prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
      },
      select: {
        id: true,
      },
    });

    return id;
  }

  async getById(id: string): Promise<User> {
    const userProps = await this.prisma.user.findUnique({
      where: {
        id,
      },
    });

    const user = User.restore(userProps, id);

    return user;
  }

  async update(id: string, user: User): Promise<User> {
    const userProps = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: user.email,
        password: user.password,
      },
    });

    return User.restore(userProps, id);
  }
}

export default new UserRepository(postgres, prisma);
