import ApplicationError from "@application/common/application-error";
import { IEncrypter, IHasher } from "@application/protocols";
import IUserRepository from "@application/repositories/user-repository";
import SignIn from "@domain/use-cases/sign-in";

export interface CheckEmailAvailability {
  checkEmail(email: string): Promise<boolean>;
}

export interface SaveVerificationToken {
  saveToken(email: string, token: string): Promise<boolean>;
}

class SignInUseCase implements SignIn.UseCase {
  constructor(
    private readonly userRepo: IUserRepository & CheckEmailAvailability,
    private readonly hasher: IHasher,
    private readonly tokenGenerator: IEncrypter,
  ) {}

  async execute(data: SignIn.Params): Promise<SignIn.Result> {
    const emailAlreadyInUse = await this.userRepo.checkEmail(data.email);

    if (emailAlreadyInUse) {
      throw new ApplicationError("Email already in use.", "EMAIL_IN_USE");
    }

    const hashedPassword = await this.hasher.hash(data.password);

    const accessToken = await this.tokenGenerator.encrypt({
      email: data.email,
      password: hashedPassword,
    });

    return {
      accessToken,
    };
  }
}

export default SignInUseCase;
