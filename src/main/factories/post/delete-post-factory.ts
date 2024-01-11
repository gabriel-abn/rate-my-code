import { DeletePostUseCase } from "@application/use-cases/posts";
import { DeletePost } from "@domain/use-cases/posts";
import postRepository from "@infra/persistence/repositories/post-repository";
import { DeletePostController } from "@presentation/controllers/post";

import { Factory } from "../factory";

class DeletePostFactory implements Factory {
  useCase: DeletePost.UseCase;
  controller: DeletePostController;

  create(): DeletePostController {
    this.useCase = new DeletePostUseCase(postRepository);

    this.controller = new DeletePostController(this.useCase);

    return this.controller;
  }
}

export default new DeletePostFactory();
