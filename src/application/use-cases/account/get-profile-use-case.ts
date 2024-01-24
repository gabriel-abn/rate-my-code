import { IUserRepository } from "@application/repositories";
import { GetProfile } from "@domain/use-cases";

export class GetProfileUseCase implements GetProfile.UseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: GetProfile.Params): Promise<GetProfile.Result> {
    const user = await this.userRepository.get({ id: params.id });

    return user.getProps();
  }
}
