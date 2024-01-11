import { IPostRepository } from "@application/repositories";
import { Post } from "@domain/entities";
import { MakePost } from "@domain/use-cases/posts";
import { randomUUID } from "crypto";

export class MakePostUseCase implements MakePost.UseCase {
  constructor(private readonly postRepository: IPostRepository) {}

  async execute(params: MakePost.Params): Promise<MakePost.Result> {
    const post = new Post(
      {
        content: params.content,
        title: params.title,
        tags: params.tags,
        userId: params.userId,
      },
      randomUUID().split("-")[0],
    );

    await this.postRepository.save(post);

    return {
      id: post.id,
    };
  }
}
