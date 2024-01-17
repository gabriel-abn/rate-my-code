import { GiveFeedbackUseCase } from "@application/use-cases/feedback";
import { GiveFeedback } from "@domain/use-cases/feedback";
import feedbackRepository from "@infra/persistence/repositories/feedback-repository";
import { GiveFeedbackController } from "@presentation/controllers/feedback";
import { Factory } from "../factory";

class GiveFeedbackFactory implements Factory {
  useCase: GiveFeedback.UseCase;
  controller: GiveFeedbackController;

  create(): GiveFeedbackController {
    this.useCase = new GiveFeedbackUseCase(feedbackRepository);
    this.controller = new GiveFeedbackController(this.useCase);

    return this.controller;
  }
}

export default new GiveFeedbackFactory();
