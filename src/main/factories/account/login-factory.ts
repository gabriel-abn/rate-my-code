import { LoginUseCase } from "@application/use-cases/account";
import { Login } from "@domain/use-cases";
import Hasher from "@infra/cryptography/hasher";
import JWTAdapter from "@infra/jwt/jwt-crypter";
import userRepository from "@infra/persistence/repositories/user-repository";
import Controller from "@presentation/common/controller";
import { LoginController } from "@presentation/controllers/account";
import { Factory } from "../factory";

class LoginFactory implements Factory {
  useCase: Login.UseCase;
  controller: LoginController;

  create(): Controller {
    this.useCase = new LoginUseCase(userRepository, new Hasher(), new JWTAdapter());
    this.controller = new LoginController(this.useCase);

    return this.controller;
  }
}

export default new LoginFactory();
