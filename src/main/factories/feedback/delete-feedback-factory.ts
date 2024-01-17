import { DeleteFeedbackUseCase } from "@application/use-cases/feedback";
import { DeleteFeedback } from "@domain/use-cases/feedback";
import { DeleteFeedbackController } from "@presentation/controllers/feedback/delete-feedback-controller";
import { Factory } from "../factory";

import feedbackRepository from "@infra/persistence/repositories/feedback-repository";

class DeleteFeedbackFactory implements Factory {
  useCase: DeleteFeedback.UseCase;
  controller: DeleteFeedbackController;

  create(): DeleteFeedbackController {
    this.useCase = new DeleteFeedbackUseCase(feedbackRepository);
    this.controller = new DeleteFeedbackController(this.useCase);

    return this.controller;
  }
}

export default new DeleteFeedbackFactory();
