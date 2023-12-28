import { Entity } from "@domain/common/entity";

type UserProps = {
  name: string;
  email: string;
  password: string;
};

class User extends Entity<UserProps> {
  constructor(props: UserProps, id: string) {
    super(props, id);
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }
}

export { User, UserProps };
