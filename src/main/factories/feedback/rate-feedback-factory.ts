import { RateFeedbackUseCase } from "@application/use-cases/feedback";
import { RateFeedback } from "@domain/use-cases/feedback";
import feedbackRepository from "@infra/persistence/repositories/feedback-repository";
import { RateFeedbackController } from "@presentation/controllers/feedback/rate-feedback-controller";

import { Factory } from "../factory";

class RateFeedbackFactory implements Factory {
  useCase: RateFeedback.UseCase;
  controller: RateFeedbackController;

  create(): RateFeedbackController {
    this.useCase = new RateFeedbackUseCase(feedbackRepository);
    this.controller = new RateFeedbackController(this.useCase);

    return this.controller;
  }
}

export default new RateFeedbackFactory();
