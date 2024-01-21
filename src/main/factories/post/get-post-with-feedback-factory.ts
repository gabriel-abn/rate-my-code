import { GetPostsWithFeedbacksUseCase } from "@application/use-cases/posts/get-post-with-feedback-use-case";
import feedbackRepository from "@infra/persistence/repositories/feedback-repository";
import postRepository from "@infra/persistence/repositories/post-repository";
import { GetPostWithFeedbacksController } from "@presentation/controllers/post";
import { Factory } from "../factory";

class GetPostWithFeedbacksFactory implements Factory {
  useCase: GetPostsWithFeedbacksUseCase;
  controller: GetPostWithFeedbacksController;

  create(): GetPostWithFeedbacksController {
    this.useCase = new GetPostsWithFeedbacksUseCase(postRepository, feedbackRepository);
    this.controller = new GetPostWithFeedbacksController(this.useCase);

    return this.controller;
  }
}

export default new GetPostWithFeedbacksFactory();
