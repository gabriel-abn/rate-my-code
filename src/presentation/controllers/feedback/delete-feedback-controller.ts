import { DeleteFeedback } from "@domain/use-cases/feedback";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const schema = z.object({
  id: z.string().uuid(),
});

export type DeleteFeedbackRequest = z.infer<typeof schema>;

export class DeleteFeedbackController extends Controller<DeleteFeedbackRequest> {
  constructor(private useCase: DeleteFeedback.UseCase) {
    super();

    this.schema = schema;
  }

  async run(request: HttpRequest<DeleteFeedbackRequest>): Promise<{ deleted: boolean }> {
    const { id } = request.body;

    const deleted = await this.useCase.execute({
      id,
    });

    return {
      deleted,
    };
  }
}
