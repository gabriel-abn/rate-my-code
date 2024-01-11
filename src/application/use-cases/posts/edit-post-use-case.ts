import ApplicationError from "@application/common/application-error";
import { IPostRepository } from "@application/repositories";
import { EditPost } from "@domain/use-cases/posts";

export class EditPostUseCase implements EditPost.UseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(params: EditPost.Params): Promise<EditPost.Result> {
    const post = await this.postRepository.get(params.id);

    if (!post) {
      throw new ApplicationError("Post not found", "POST_NOT_FOUND");
    }

    post.title = params.title;
    post.content = params.content;
    post.tags = params.tags;

    await this.postRepository.update(post);

    return {
      id: post.id,
    };
  }
}
