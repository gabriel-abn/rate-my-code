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
      .then((posts) => {
        if (posts.length === 0) {
          return [];
        }

        return Promise.all(
          posts.map(async (post) => {
            const author = await this.userRepository.getById(post.userId);

            return {
              post,
              author,
            };
          }),
        );
      });

    if (result.length === 0) {
      return [];
    }

    return result.map((res) => ({
      post: res.post,
      author: res.author.getProps(),
    }));
  }
}
