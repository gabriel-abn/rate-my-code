import ApplicationError from "@application/common/application-error";
import { User } from "@domain/entities";
import { VerifyEmail } from "@domain/use-cases";

export interface CheckUserEmail {
  getByEmail(email: string): Promise<User>;
  verifyEmail(email: string): Promise<void>;
}

export interface CheckToken {
  checkEmail(email: string): Promise<boolean>;
  checkToken(email: string, token: string): Promise<boolean>;
}

export class VerifyEmailUseCase implements VerifyEmail.UseCase {
  constructor(
    private userRepo: CheckUserEmail,
    private tokenRepo: CheckToken,
  ) {}

  async execute(params: VerifyEmail.Params): Promise<VerifyEmail.Result> {
    const user = await this.userRepo.getByEmail(params.email);

    if (!user) {
      throw new ApplicationError("User not found.", "EMAIL_NOT_FOUND");
    }

    if (!(await this.tokenRepo.checkEmail(params.email))) {
      throw new ApplicationError("Token has expired.", "EXPIRED_TOKEN");
    }

    if (!(await this.tokenRepo.checkToken(params.email, params.token))) {
      throw new ApplicationError("Invalid token.", "INVALID_TOKEN");
    }

    await this.userRepo.verifyEmail(params.email);

    return {
      isVerified: true,
      message: "Email verified successfully.",
    };
  }
}
