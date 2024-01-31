import postRepository from "@infra/persistence/repositories/post-repository";
import userRepository from "@infra/persistence/repositories/user-repository";
import { GetAllPostsController } from "@presentation/controllers/post";
import { Factory } from "../factory";

class GetAllPostsFactory implements Factory {
  useCase = null;
  controller: GetAllPostsController;

  create(): GetAllPostsController {
    this.controller = new GetAllPostsController(postRepository, userRepository);

    return this.controller;
  }
}

export default new GetAllPostsFactory();
