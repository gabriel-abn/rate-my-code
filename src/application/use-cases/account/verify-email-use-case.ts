import ApplicationError from "@application/common/application-error";
import IUserRepository from "@application/repositories/user-repository";
import { VerifyEmail } from "@domain/use-cases";

export interface CheckUserEmail {
  verifyEmail(email: string): Promise<void>;
}

export interface CheckToken {
  checkEmail(email: string): Promise<boolean>;
  checkToken(email: string, token: string): Promise<boolean>;
}

export class VerifyEmailUseCase implements VerifyEmail.UseCase {
  constructor(
    private userRepo: IUserRepository,
    private checkUser: CheckUserEmail,
    private tokenRepo: CheckToken,
  ) {}

  async execute(params: VerifyEmail.Params): Promise<VerifyEmail.Result> {
    const [user, isVerified] = await this.userRepo.getByEmail(params.email);

    if (!user) {
      throw new ApplicationError("User not found.", "EMAIL_NOT_FOUND");
    }

    if (isVerified) {
      throw new ApplicationError("Email already verified.", "EMAIL_ALREADY_VERIFIED");
    }

    if (!(await this.tokenRepo.checkEmail(params.email))) {
      throw new ApplicationError("Token has expired.", "EXPIRED_TOKEN");
    }

    if (!(await this.tokenRepo.checkToken(params.email, params.token))) {
      throw new ApplicationError("Invalid token.", "INVALID_TOKEN");
    }

    await this.checkUser.verifyEmail(params.email);

    return {
      isVerified: true,
      message: "Email verified successfully.",
    };
  }
}
