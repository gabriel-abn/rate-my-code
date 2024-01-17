import ApplicationError from "@application/common/application-error";
import { IFeedbackRepository } from "@application/repositories";
import { RateFeedback } from "@domain/use-cases/feedback";

export class RateFeedbackUseCase implements RateFeedback.UseCase {
  constructor(private readonly repository: IFeedbackRepository) {}

  async execute(params: RateFeedback.Params): Promise<RateFeedback.Result> {
    const { id, rating } = params;

    const feedback = await this.repository.get(id);

    feedback.rates = feedback.rates + 1;
    feedback.rating = (feedback.rating + rating) / feedback.rates;

    const updated = await this.repository.update(feedback);

    if (!updated) {
      throw new ApplicationError("Error while saving feedback", "FEEDBACK_RATING_ERROR");
    }

    return {
      updatedRating: feedback.rating,
    };
  }
}
