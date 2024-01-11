import IUserRepository from "@application/repositories/user-repository";
import { CheckEmailAvailability, CheckUserEmail } from "@application/use-cases";
import { User } from "@domain/entities";
import { RelationalDatabase } from "../common";
import postgres from "../database/postgres";

class UserRepository implements IUserRepository, CheckEmailAvailability, CheckUserEmail {
  constructor(private database: RelationalDatabase) {}

  // TODO Remove this method
  async checkEmail(email: string): Promise<boolean> {
    const user = await this.database
      .query(
        `
          SELECT  id
          FROM    user
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
          UPDATE  user
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
          SELECT  u.id, u.email, u.password, u.email_verified AS "emailVerified", r.id as "role"
          FROM    user u JOIN (developer d UNION ALL instructor i) r
          WHERE   u.email = $1;
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
    const { id } = await this.database
      .execute(
        `
          INSERT INTO user (email, password)
          VALUES ($1, $2)
          RETURNING id;
        `,
        [user.email, user.password],
      )
      .then(async (rows) => {
        const id = rows[0].id;

        if (user.role == "INSTRUCTOR") {
          await this.database.execute(
            `
              INSERT INTO instructor (user_id, first_name, last_name)
              VALUES ($1, $2, $3);
            `,
            [id, user.profile.firstName, user.profile.lastName],
          );

          return id;
        }
      });

    return id;
  }

  async getById(id: string): Promise<User> {
    const userProps = await this.database
      .query(
        `
          SELECT  u.id, u.email, u.password, u.email_verified AS "emailVerified", r.id as "roleId"
          FROM    user u JOIN (developer d UNION ALL instructor i) r
          WHERE   u.id = $1;
        `,
        [id],
      )
      .then((rows) => rows[0]);

    const user = User.restore(userProps, id);

    return user;
  }

  async update(id: string, user: User): Promise<boolean> {
    const updated = await this.database.execute(
      `
        UPDATE  user
        SET     password = $2, role = $3
        WHERE   id = $1;
      `,
      [id, user.password, user.role],
    );

    if (!updated) {
      return false;
    }

    return true;
  }
}

export default new UserRepository(postgres);
