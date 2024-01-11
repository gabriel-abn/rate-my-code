import { SignInUseCase } from "@application/use-cases";

import { SignIn } from "@domain/use-cases";

import Hasher from "@infra/cryptography/hasher";
import jwtAdapter from "@infra/jwt/jwt-crypter";
import tokenRepository from "@infra/persistence/repositories/token-repository";
import userRepository from "@infra/persistence/repositories/user-repository";
import emailService from "@infra/services/email-service";

import { Controller } from "@presentation/common/controller";
import { SignInController } from "@presentation/controllers";

import { Factory } from "../factory";

class SignInFactory implements Factory {
  useCase: SignIn.UseCase;
  controller: SignInController;

  create(): Controller<any> {
    this.useCase = new SignInUseCase(
      userRepository,
      new Hasher(),
      jwtAdapter,
      tokenRepository,
      emailService,
    );

    this.controller = new SignInController(this.useCase);

    return this.controller;
  }
}

export default new SignInFactory();
