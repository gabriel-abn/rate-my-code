import ApplicationError from "@application/common/application-error";
import { GetPostWithFeedback } from "@domain/use-cases/posts/get-post-with-feedback";
import { Controller, HttpRequest } from "@presentation/common";

import { z } from "zod";

export class GetPostWithFeedbacksController extends Controller<null> {
  constructor(private readonly useCase: GetPostWithFeedback.UseCase) {
    super();
    this.schema = z.object({});
  }

  async run(request: HttpRequest<null>): Promise<GetPostWithFeedback.Result> {
    const { id } = request.params;

    if (!id) {
      throw new ApplicationError("No id provided", "NO_ID_PROVIDED");
    }

    const post = await this.useCase.execute({ id });

    return post;
  }
}
