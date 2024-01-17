import { EditFeedbackUseCase } from "@application/use-cases/feedback";
import { EditFeedback } from "@domain/use-cases/feedback";
import feedbackRepository from "@infra/persistence/repositories/feedback-repository";
import { EditFeedbackController } from "@presentation/controllers/feedback";
import { Factory } from "../factory";

class EditFeedbackFactory implements Factory {
  useCase: EditFeedback.UseCase;
  controller: EditFeedbackController;

  create(): EditFeedbackController {
    this.useCase = new EditFeedbackUseCase(feedbackRepository);
    this.controller = new EditFeedbackController(this.useCase);

    return this.controller;
  }
}

export default new EditFeedbackFactory();
