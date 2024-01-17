import ApplicationError from "@application/common/application-error";
import { IFeedbackRepository } from "@application/repositories";
import { DeleteFeedback } from "@domain/use-cases/feedback";

export class DeleteFeedbackUseCase implements DeleteFeedback.UseCase {
  constructor(private repository: IFeedbackRepository) {}

  async execute(params: DeleteFeedback.Params): Promise<DeleteFeedback.Result> {
    const exists = await this.repository.get(params.id);

    if (!exists) {
      throw new ApplicationError("Feedback not found", "NOT_FOUND");
    }

    const deleted = await this.repository.delete(params.id);

    if (!deleted) {
      throw new ApplicationError("Feedback not deleted", "NOT_DELETED");
    }

    return deleted;
  }
}
