import { Entity } from "@domain/common/entity";

type Profile = {
  firstName: string;
  lastName: string;
  avatar: string;
};

type UserProps = {
  profile: Profile;
  email: string;
  password: string;
  emailVerified: boolean;
  username: string;
  tags: string[];
  role: string;
  roleId?: string;
};

class User extends Entity<UserProps> {
  constructor(props: Omit<UserProps, "profile" | "emailVerified">, id?: string) {
    super(
      {
        profile: undefined,
        emailVerified: false,
        ...props,
      },
      id ? id : undefined,
    );
  }

  get profile(): Profile {
    return this.props.profile;
  }

  set profile(profile: Partial<Profile>) {
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

  get isVerified(): boolean {
    return this.props.emailVerified;
  }

  get role(): string {
    return this.props.role;
  }

  get username(): string {
    return this.props.username;
  }

  get tags(): string[] {
    return this.props.tags;
  }

  set tags(tags: string[]) {
    this.props.tags = tags;
  }

  static restore(props: UserProps, id: string): User {
    return new User(props, id);
  }
}

export { Profile, User, UserProps };
