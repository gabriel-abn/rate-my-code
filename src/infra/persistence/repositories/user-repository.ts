import { IUserRepository } from "@application/repositories";
import { CheckEmailAvailability, CheckUserEmail } from "@application/use-cases";
import { User } from "@domain/entities";
import { randomUUID } from "crypto";
import { DatabaseError, ListDatabase, RelationalDatabase } from "../common";
import postgres from "../database/postgres";
import redisDb from "../database/redis-db";

class UserRepository implements IUserRepository, CheckEmailAvailability, CheckUserEmail {
  constructor(
    private readonly relational: RelationalDatabase,
    private readonly list: ListDatabase,
  ) {}

  async get(
    filter: Partial<{ username: string; email: string; id: string }>,
  ): Promise<User> {
    try {
      const { username, email, id } = filter;

      const userProps = await this.relational
        .query(
          `
          SELECT  *
          FROM public.users_view
          WHERE ${
            username ? "username = $1" : email ? "email = $1" : id ? "id = $1" : ""
          };
          `,
          [username || email || id],
        )
        .then(async (rows) => {
          const props = rows[0];

          if (!props) {
            throw new DatabaseError("User not found");
          }

          const tags = await this.list.getList("user:" + props.id).catch((error) => {
            throw new DatabaseError("User's tags not found " + error.message, error);
          });

          return {
            ...props,
            tags,
            profile: {
              firstName: props.firstName,
              lastName: props.lastName,
              avatar: props.avatar,
            },
          };
        })
        .catch((error) => {
          throw new DatabaseError("User not found. " + error.message, error);
        });

      const user = User.restore(userProps, userProps.id);

      return user;
    } catch (error) {
      throw new DatabaseError("User not found. " + error.message, error);
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.relational
      .query(
        `
          SELECT  id
          FROM    public.user
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
    await this.relational.query(
      `
          UPDATE  public.user
          SET     email_verified = true
          WHERE   email = $1;
        `,
      [email],
    );
  }

  async save(user: User): Promise<string> {
    try {
      await this.relational
        .execute(
          `
            INSERT INTO public.user (id, email, password, username, role)
            VALUES ($1, $2, $3, $4, $5);
          `,
          [user.id, user.email, user.password, user.username, user.role],
        )
        .then(async () => {
          await this.relational.execute(
            `
              INSERT INTO public.profile (id, user_id)
              VALUES ($1, $2);
            `,
            [randomUUID().split("-")[0].toUpperCase(), user.id],
          );
        })
        .then(async () => {
          if (user.role == "INSTRUCTOR") {
            await this.relational.execute(
              `
                INSERT INTO public.instructor (id, user_id)
                VALUES ($1, $2);
                `,
              [randomUUID().split("-")[0], user.id],
            );
          }

          await this.relational.execute(
            `
            INSERT INTO public.developer (id, user_id)
            VALUES ($1, $2);
            `,
            [randomUUID().split("-")[0], user.id],
          );
        })
        .then(async () => {
          await this.list.addToList("user:" + user.id, ...user.tags);
        });

      return user.id;
    } catch (error) {
      throw new DatabaseError("User not saved. " + error.message, error);
    }
  }

  async update(id: string, user: User): Promise<boolean> {
    const updated = await this.relational
      .execute(
        `
        UPDATE  public.user
        SET     password = $2, role = $3
        WHERE   id = $1;
        `,
        [id, user.password, user.role],
      )
      .then(
        async () =>
          await this.relational
            .execute(
              `
              UPDATE  public.profile
              SET     first_name = $2, last_name = $3, avatar_url = $4
              WHERE   user_id = $1;
              `,
              [id, user.profile.firstName, user.profile.lastName, user.profile.avatar],
            )
            .then(async () => {
              await this.list.deleteList("user:" + id);
              await this.list.addToList("user:" + id, ...user.tags);

              return true;
            }),
      )
      .catch((error) => {
        throw new DatabaseError("User not updated. " + error.message, error);
      });

    if (!updated) {
      return false;
    }

    return true;
  }
}

export default new UserRepository(postgres, redisDb);
