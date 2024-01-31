import ApplicationError from "@application/common/application-error";
import { IFeedbackRepository, IPostRepository } from "@application/repositories";
import { GetPostWithFeedback } from "@domain/use-cases/posts/get-post-with-feedback";

export class GetPostsWithFeedbacksUseCase implements GetPostWithFeedback.UseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly feedbackRepository: IFeedbackRepository,
  ) {}

  async execute(
    request: GetPostWithFeedback.Params,
  ): Promise<GetPostWithFeedback.Result> {
    const post = await this.postRepository.get(request.id);

    if (!post) {
      throw new ApplicationError("Post not found", "POST_NOT_FOUND");
    }

    const feedbacks = await this.feedbackRepository.getAll({ post: post.id });

    return {
      post: post.getProps(),
      feedback: feedbacks.map((feedback) => feedback.getProps()),
    };
  }
}
