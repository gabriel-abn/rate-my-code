import { EditPostUseCase } from "@application/use-cases/posts";
import { EditPost } from "@domain/use-cases/posts";
import postRepository from "@infra/persistence/repositories/post-repository";
import { EditPostController } from "@presentation/controllers/post";
import { Factory } from "../factory";

class EditPostFactory implements Factory {
  useCase: EditPost.UseCase;
  controller: EditPostController;

  create(): EditPostController {
    this.useCase = new EditPostUseCase(postRepository);

    this.controller = new EditPostController(this.useCase);

    return this.controller;
  }
}

export default new EditPostFactory();
