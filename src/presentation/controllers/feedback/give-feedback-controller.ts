import { GiveFeedback } from "@domain/use-cases/feedback";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const schema = z.object({
  postId: z.string(),
  content: z.string().min(3).max(10000),
});

export type GiveFeedbackRequest = z.infer<typeof schema>;

export class GiveFeedbackController extends Controller<GiveFeedbackRequest> {
  constructor(private readonly useCase: GiveFeedback.UseCase) {
    super();

    this.schema = schema;
  }

  async run(request: HttpRequest<GiveFeedbackRequest>): Promise<{ id: string }> {
    const { postId, content } = request.body;
    const { userId } = request.headers;

    const response = await this.useCase.execute({
      postId,
      userId,
      content,
    });

    return {
      id: response.id,
    };
  }
}
