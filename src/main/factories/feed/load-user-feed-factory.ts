import { GetMostUsedTagsUseCase } from "@application/use-cases/posts/get-most-used-tags-use-case";
import { LoadPostsUseCase } from "@application/use-cases/posts/load-posts-use-case";
import { GetUserUseCase } from "@application/use-cases/user";
import { UseCase } from "@domain/common/use-case";
import feedbackRepository from "@infra/persistence/repositories/feedback-repository";
import postRepository from "@infra/persistence/repositories/post-repository";
import userRepository from "@infra/persistence/repositories/user-repository";
import { LoadUserFeedController } from "@presentation/controllers/feed/load-user-feed-controller";
import { Factory } from "../factory";

class LoadUserFeedFactory implements Factory {
  useCase: UseCase<any, any>;
  controller: LoadUserFeedController;

  create(): LoadUserFeedController {
    this.controller = new LoadUserFeedController(
      new GetUserUseCase(userRepository, feedbackRepository),
      new LoadPostsUseCase(postRepository, userRepository),
      new GetMostUsedTagsUseCase(postRepository),
    );

    return this.controller;
  }
}

export default new LoadUserFeedFactory();
