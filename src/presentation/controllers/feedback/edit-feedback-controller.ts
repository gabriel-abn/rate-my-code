import { EditFeedback } from "@domain/use-cases/feedback";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  content: z.string().min(3).max(10000),
});

export type EditFeedbackRequest = z.infer<typeof schema>;

export class EditFeedbackController extends Controller<EditFeedbackRequest> {
  constructor(private readonly useCase: EditFeedback.UseCase) {
    super();

    this.schema = schema;
  }

  async run(request: HttpRequest<EditFeedbackRequest>): Promise<{ updated: boolean }> {
    const { id, content } = request.body;

    const response = await this.useCase.execute({
      id,
      content,
    });

    return {
      updated: response,
    };
  }
}
