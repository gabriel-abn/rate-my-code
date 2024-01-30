import { IFeedbackRepository, IUserRepository } from "@application/repositories";
import { GetUser } from "@domain/use-cases/user";

export class GetUserUseCase implements GetUser.UseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly feedbacksRepository: IFeedbackRepository,
  ) {}

  async execute(params: GetUser.Params): Promise<GetUser.Result> {
    const user = await this.userRepository.get({ id: params.userId });

    const feedbacks = await this.feedbacksRepository.getAll({
      user: user.id,
    });

    return {
      ...user.getProps(),
      feedbacks: feedbacks.length,
      rating: feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / feedbacks.length,
    };
  }
}
