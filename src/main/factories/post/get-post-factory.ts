import postRepository from "@infra/persistence/repositories/post-repository";
import { GetPostController } from "@presentation/controllers/post";
import { Factory } from "../factory";

class GetPostFactory implements Factory {
  useCase = null;
  controller: GetPostController;

  create(): GetPostController {
    this.controller = new GetPostController(postRepository);

    return this.controller;
  }
}

export default new GetPostFactory();
