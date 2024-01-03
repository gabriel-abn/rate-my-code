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
          SELECT  id
          FROM    "user"
          WHERE   email = $1;
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
          UPDATE  "user"
          SET     email_verified = true
          WHERE   email = $1;
        `,
      [email],
    );
  }

  async getByEmail(email: string): Promise<[User, boolean]> {
    const user = await this.database
      .query(
        `
          SELECT  id, email, password, email_verified AS "emailVerified"
          FROM    "user"
          WHERE   email = $1;
        `,
        [email],
      )
      .then((rows) => rows[0]);

    if (!user) {
      return [null, false];
    }

    return [User.restore(user, user.id), user.emailVerified];
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

  async update(id: string, user: User): Promise<boolean> {
    const userProps = await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: user.email,
        password: user.password,
      },
      select: {
        id: true,
      },
    });

    if (!userProps) {
      return false;
    }

    return true;
  }
}

export default new UserRepository(postgres, prisma);
