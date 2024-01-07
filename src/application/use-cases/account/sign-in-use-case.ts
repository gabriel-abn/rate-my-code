import ApplicationError from "@application/common/application-error";
import { IEncrypter, IHasher } from "@application/protocols";
import SendEmail from "@application/protocols/services/send-email";
import IUserRepository from "@application/repositories/user-repository";
import { User } from "@domain/entities";
import { SignIn } from "@domain/use-cases";
import { randomUUID } from "crypto";

export interface CheckEmailAvailability {
  checkEmail(email: string): Promise<boolean>;
}

export interface SaveVerificationToken {
  saveToken(email: string, token: string): Promise<void>;
}

export class SignInUseCase implements SignIn.UseCase {
  constructor(
    private readonly userRepo: IUserRepository & CheckEmailAvailability,
    private readonly hasher: IHasher,
    private readonly crypter: IEncrypter,
    private readonly saveToken: SaveVerificationToken,
    private readonly sendEmail: SendEmail.Service,
  ) {}

  async execute(data: SignIn.Params): Promise<SignIn.Result> {
    const emailAlreadyInUse = await this.userRepo.checkEmail(data.email);

    if (emailAlreadyInUse) {
      throw new ApplicationError("Email already in use.", "EMAIL_IN_USE");
    }

    const hashedPassword = await this.hasher.hash(data.password);

    const user = new User({
      email: data.email,
      password: hashedPassword,
      role: data.role,
    });

    const confirmationToken = randomUUID().split("-")[0].toUpperCase();

    const emailSent = await this.sendEmail.send({
      to: user.email,
      template: "email-confirmation",
      data: {
        token: confirmationToken,
      },
    });

    if (!emailSent) {
      throw new ApplicationError("Error sending email.", "EMAIL_SEND_ERROR");
    }

    await this.saveToken.saveToken(user.email, confirmationToken);

    const savedUser = await this.userRepo.save(user);

    const accessToken = this.crypter.encrypt({
      id: savedUser,
      email: user.email,
    });

    return {
      accessToken,
    };
  }
}
