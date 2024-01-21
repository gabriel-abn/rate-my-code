import { IUserRepository } from "@application/repositories";
import { CheckEmailAvailability, CheckUserEmail } from "@application/use-cases";
import { User } from "@domain/entities";
import { randomUUID } from "crypto";
import { DatabaseError, RelationalDatabase } from "../common";
import postgres from "../database/postgres";

class UserRepository implements IUserRepository, CheckEmailAvailability, CheckUserEmail {
  constructor(private database: RelationalDatabase) {}

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.database
      .query(
        `
          SELECT  id
          FROM    public."user"
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
          UPDATE  public.user
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
          SELECT  u.id, u.email, u.password, u.email_verified AS "emailVerified", r.id as "roleId"
          FROM    public.user u JOIN (
            (SELECT * 
            FROM public.developer d)
            UNION
            (SELECT *
            FROM  public.instructor i)
              ) r 
          ON u.id = r.user_id
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
    await this.database
      .execute(
        `
          INSERT INTO public.user (id, email, password)
          VALUES ($1, $2, $3);
        `,
        [user.id, user.email, user.password],
      )
      .then(async () => {
        await this.database.execute(
          `
            INSERT INTO public.profile (id, user_id)
            VALUES ($1, $2);
          `,
          [randomUUID().split("-")[0].toUpperCase(), user.id],
        );
      })
      .then(async () => {
        if (user.role == "INSTRUCTOR") {
          await this.database.execute(
            `
              INSERT INTO public.instructor (id, user_id)
              VALUES ($1, $2);
              `,
            [randomUUID().split("-")[0], user.id],
          );
        }

        await this.database.execute(
          `
          INSERT INTO public.developer (id, user_id)
          VALUES ($1, $2);
          `,
          [randomUUID().split("-")[0], user.id],
        );
      });

    return user.id;
  }

  async getById(id: string): Promise<User> {
    const userProps = await this.database
      .query(
        `
        SELECT  U.id, U.email, U.password, 
                U.email_verified AS "emailVerified", R.id AS "roleId",
                p.first_name AS "firstName", p.last_name AS "lastName", p.avatar_url as "avatar", u.tags
        FROM    public.user U
        JOIN (
              (SELECT *
              FROM public.developer D)
        UNION
              (SELECT *
              FROM public.instructor I)) R ON U.id = R.user_id
        LEFT JOIN public.profile p on U.id = p.user_id
        WHERE   u.id = $1;
        `,
        [id],
      )
      .then((rows) => rows[0])
      .then((props) => {
        if (!props) {
          throw new DatabaseError("User not found");
        }

        return {
          ...props,
          profile: {
            firstName: props.firstName,
            lastName: props.lastName,
            avatar: props.avatar,
            tags: props.tags,
          },
        };
      });

    const user = User.restore(userProps, id);

    return user;
  }

  async update(id: string, user: User): Promise<boolean> {
    const updated = await this.database
      .execute(
        `
        UPDATE  public.user
        SET     password = $2, role = $3, tags = $4
        WHERE   id = $1;
      `,
        [id, user.password, user.role, user.tags],
      )
      .then(
        async () =>
          await this.database.execute(
            `
          UPDATE  public.profile
          SET     first_name = $2, last_name = $3, avatar_url = $4
          WHERE   user_id = $1;
        `,
            [id, user.profile.firstName, user.profile.lastName, user.profile.avatar],
          ),
      );

    if (!updated) {
      return false;
    }

    return true;
  }
}

export default new UserRepository(postgres);
