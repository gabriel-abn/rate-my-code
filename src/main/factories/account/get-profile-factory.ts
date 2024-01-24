import { GetProfileUseCase } from "@application/use-cases/account/get-profile-use-case";
import { GetProfile } from "@domain/use-cases";
import userRepository from "@infra/persistence/repositories/user-repository";
import { GetProfileController } from "@presentation/controllers/account/get-profile-controller";
import { Factory } from "../factory";

class GetProfileFactory implements Factory {
  useCase: GetProfile.UseCase;
  controller: GetProfileController;

  create(): any {
    this.useCase = new GetProfileUseCase(userRepository);
    this.controller = new GetProfileController(this.useCase);

    return this.controller;
  }
}

export default new GetProfileFactory();
