import { VerifyEmailUseCase } from "@application/use-cases";
import { VerifyEmail } from "@domain/use-cases";
import tokenRepository from "@infra/persistence/repositories/token-repository";
import userRepository from "@infra/persistence/repositories/user-repository";
import { VerifyEmailController } from "@presentation/controllers/account/verify-email-controller";
import { Factory } from "../factory";

class VerifyEmailFactory implements Factory {
  useCase: VerifyEmail.UseCase;
  controller: VerifyEmailController;

  create(): VerifyEmailController {
    this.useCase = new VerifyEmailUseCase(
      userRepository,
      userRepository,
      tokenRepository,
    );

    this.controller = new VerifyEmailController(this.useCase);

    return this.controller;
  }
}

export default new VerifyEmailFactory();
