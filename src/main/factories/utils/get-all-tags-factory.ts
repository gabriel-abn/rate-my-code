import { UseCase } from "@domain/common/use-case";
import postRepository from "@infra/persistence/repositories/post-repository";
import { GetAllTagsController } from "@presentation/controllers/utils";
import { Factory } from "../factory";

class GetAllTagsFactory implements Factory {
  useCase: UseCase<any, any>;
  controller: GetAllTagsController;

  create(): GetAllTagsController {
    this.useCase = null;
    this.controller = new GetAllTagsController(postRepository);

    return this.controller;
  }
}

export default new GetAllTagsFactory();
