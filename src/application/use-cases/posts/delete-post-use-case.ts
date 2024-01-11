import ApplicationError from "@application/common/application-error";
import { IPostRepository } from "@application/repositories";
import { DeletePost } from "@domain/use-cases/posts";

export class DeletePostUseCase implements DeletePost.UseCase {
  constructor(private postRespository: IPostRepository) {}

  async execute(params: DeletePost.Params): Promise<DeletePost.Result> {
    const post = await this.postRespository.get(params.id);

    if (!post) {
      throw new ApplicationError("Post not found", "POST_NOT_FOUND");
    }

    await this.postRespository.delete(post.id);

    return true;
  }
}
