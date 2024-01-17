import { RateFeedback } from "@domain/use-cases/feedback";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  rating: z
    .number()
    .min(1, "Rating must be between 1 and 5.")
    .max(5, "Rating must be between 1 and 5."),
});

export type RateFeedbackRequest = z.infer<typeof schema>;

export class RateFeedbackController extends Controller<RateFeedbackRequest> {
  constructor(private readonly useCase: RateFeedback.UseCase) {
    super();

    this.schema = schema;
  }

  async run(
    request: HttpRequest<RateFeedbackRequest>,
  ): Promise<RateFeedback.Result & { rated: boolean }> {
    const { id, rating } = request.body;

    const response = await this.useCase.execute({
      id,
      rating,
    });

    return {
      ...response,
      rated: true,
    };
  }
}
