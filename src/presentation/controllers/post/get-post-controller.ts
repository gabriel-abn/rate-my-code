import { GetPostWithFeedback } from "@domain/use-cases/posts/get-post-with-feedback";
import { Controller, HttpRequest } from "@presentation/common";

import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

export type GetPostsWithFeedbacksControllerRequest = z.infer<typeof schema>;

export class GetPostWithFeedbacksController extends Controller<GetPostsWithFeedbacksControllerRequest> {
  constructor(private readonly useCase: GetPostWithFeedback.UseCase) {
    super();
    this.schema = schema;
  }

  async run(
    request: HttpRequest<GetPostsWithFeedbacksControllerRequest>,
  ): Promise<GetPostWithFeedback.Result> {
    const { id } = request.body;

    const post = await this.useCase.execute({ id });

    return post;
  }
}
