import ApplicationError from "@application/common/application-error";
import { IEncrypter, IHasher } from "@application/protocols";
import { IUserRepository } from "@application/repositories/user-repository";
import { Login } from "@domain/use-cases";

export class LoginUseCase implements Login.UseCase {
  constructor(
    private userRepo: IUserRepository,
    private hasher: IHasher,
    private crypter: IEncrypter,
  ) {}

  async execute(params: Login.Params): Promise<Login.Result> {
    const { email, password } = params;

    const user = await this.userRepo.get({ email });

    const verified = user.isVerified;

    if (!user) {
      throw new ApplicationError(
        "Email is incorrect or user does not exists.",
        "USER_NOT_FOUND",
      );
    }

    const isValidPassword = await this.hasher.compare(password, user.password);

    if (!isValidPassword) {
      throw new ApplicationError("Invalid password.", "INVALID_PASSWORD");
    }

    if (verified === false) {
      throw new ApplicationError("Email not verified.", "EMAIL_NOT_VERIFIED");
    }

    const token = this.crypter.encrypt({ id: user.id, role: user.role });

    return {
      accessToken: token,
      refreshToken: token,
    };
  }
}
