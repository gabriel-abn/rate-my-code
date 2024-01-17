import ApplicationError from "@application/common/application-error";
import { IFeedbackRepository } from "@application/repositories";
import { Feedback } from "@domain/entities";
import { GiveFeedback } from "@domain/use-cases/feedback";
import { randomUUID } from "crypto";

export class GiveFeedbackUseCase implements GiveFeedback.UseCase {
  constructor(private readonly feedbackRepository: IFeedbackRepository) {}

  async execute(params: GiveFeedback.Params): Promise<GiveFeedback.Result> {
    const feedback = new Feedback(
      {
        userId: params.userId,
        postId: params.postId,
        content: params.content,
      },
      randomUUID().split("-")[0],
    );

    const saved = await this.feedbackRepository.save(feedback);

    if (!saved) {
      throw new ApplicationError("Error while saving feedback", "FEEDBACK_SAVE_ERROR");
    }

    return {
      id: feedback.id,
    };
  }
}
