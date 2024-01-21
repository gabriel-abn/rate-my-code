import { IPostRepository } from "@application/repositories";
import { GetMostUsedTags } from "@domain/use-cases/posts";

export class GetMostUsedTagsUseCase implements GetMostUsedTags.UseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(params: GetMostUsedTags.Params): Promise<GetMostUsedTags.Result> {
    const posts = await this.postRepository.getAll();

    const result = posts.reduce(
      (last, current) => {
        current.tags.forEach((tag) => {
          if (last[tag]) {
            last[tag] += 1;
          } else {
            last[tag] = 1;
          }
        });
        return last;
      },
      {} as Record<string, number>,
    );

    const sorted = Object.entries(result).sort((a, b) => b[1] - a[1]);
    const limited = sorted.slice(0, params.limit);
    const tags = limited.map((tag) => tag[0]);

    return { tags };
  }
}
