import { MakePostUseCase } from "@application/use-cases/posts";
import { MakePost } from "@domain/use-cases/posts";
import { MakePostController } from "@presentation/controllers/post";

import postRepository from "@infra/persistence/repositories/post-repository";
import { Factory } from "../factory";

class MakePostFactory implements Factory {
  useCase: MakePost.UseCase;
  controller: MakePostController;

  create(): MakePostController {
    this.useCase = new MakePostUseCase(postRepository);

    this.controller = new MakePostController(this.useCase);

    return this.controller;
  }
}

export default new MakePostFactory();
