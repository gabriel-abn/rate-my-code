import ApplicationError from "@application/common/application-error";
import { IFeedbackRepository } from "@application/repositories";
import { EditFeedback } from "@domain/use-cases/feedback";

export class EditFeedbackUseCase implements EditFeedback.UseCase {
  constructor(private repository: IFeedbackRepository) {}

  async execute(params: EditFeedback.Params): Promise<EditFeedback.Result> {
    const feedback = await this.repository.get(params.id);

    feedback.content = params.content;

    const updated = await this.repository.update(feedback);

    if (!updated) {
      throw new ApplicationError(
        "Error while updating feedback",
        "FEEDBACK_UPDATE_ERROR",
      );
    }

    return updated;
  }
}
