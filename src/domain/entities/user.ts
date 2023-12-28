import { Entity } from "@domain/common/entity";

type UserProps = {
  profile?: {
    firstName: string;
    lastName: string;
    avatar: string;
  };
  email: string;
  password: string;
};

class User extends Entity<UserProps> {
  constructor(props: Omit<UserProps, "profile">, id: string) {
    super(props, id);
  }

  get profile(): { firstName: string; lastName: string; avatar: string } {
    return this.props.profile;
  }

  set profile(profile: Partial<UserProps["profile"]>) {
    this.props.profile = {
      ...this.props.profile,
      ...profile,
    };
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }
}

export { User, UserProps };
