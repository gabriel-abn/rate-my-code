import { IPostRepository } from "@application/repositories";
import { Post } from "@domain/entities";
import { Controller, HttpRequest } from "@presentation/common";

import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

export type GetPostsControllerRequest = z.infer<typeof schema>;

export class GetPostController extends Controller<GetPostsControllerRequest> {
  constructor(private readonly postRepository: IPostRepository) {
    super();
    this.schema = schema;
  }

  async run(request: HttpRequest<GetPostsControllerRequest>): Promise<Post> {
    const { id } = request.body;

    const post = await this.postRepository.get(id);

    return post;
  }
}
