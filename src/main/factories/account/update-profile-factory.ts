import { UpdateProfileUseCase } from "@application/use-cases";
import { UpdateProfile } from "@domain/use-cases";
import userRepository from "@infra/persistence/repositories/user-repository";
import { Controller } from "@presentation/common/controller";
import { UpdateProfileController } from "@presentation/controllers/account/update-profile-controller";
import { Factory } from "../factory";

class UpdateProfileFactory implements Factory {
  useCase: UpdateProfile.UseCase;
  controller: UpdateProfileController;

  create(): Controller<any> {
    this.useCase = new UpdateProfileUseCase(userRepository);

    this.controller = new UpdateProfileController(this.useCase);

    return this.controller;
  }
}

export default new UpdateProfileFactory();
