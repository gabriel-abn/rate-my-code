import postRepository from "@infra/persistence/repositories/post-repository";
import { GetAllPostsController } from "@presentation/controllers/post";
import { Factory } from "../factory";

class GetAllPostsFactory implements Factory {
  useCase = null;
  controller: GetAllPostsController;

  create(): GetAllPostsController {
    this.controller = new GetAllPostsController(postRepository);

    return this.controller;
  }
}

export default new GetAllPostsFactory();
