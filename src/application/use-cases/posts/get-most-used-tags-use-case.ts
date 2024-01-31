import { IPostRepository } from "@application/repositories";
import { GetMostUsedTags } from "@domain/use-cases/posts";

export class GetMostUsedTagsUseCase implements GetMostUsedTags.UseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(params: GetMostUsedTags.Params): Promise<GetMostUsedTags.Result> {
    const tags = await this.postRepository.mostUsedTags();

    if (params.limit) {
      return { tags: tags.slice(0, params.limit) };
    }

    return { tags };
  }
}
