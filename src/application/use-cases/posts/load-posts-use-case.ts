import { IPostRepository, IUserRepository } from "@application/repositories";
import { LoadPosts } from "@domain/use-cases/posts";

export class LoadPostsUseCase implements LoadPosts.UseCase {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: LoadPosts.Params): Promise<LoadPosts.Result> {
    const result = await this.postRepository
      .getAll({ tags: params.tags })
      .then(async (posts) => {
        if (posts.length === 0) {
          return [];
        }

        return await Promise.all(
          posts.map(async (post) => {
            const author = await this.userRepository
              .get({
                id: post.userId,
              })
              .then((author) => author.getProps());

            return {
              post,
              author,
            };
          }),
        );
      });

    return result;
  }
}
