import { IPostRepository, IUserRepository } from "@application/repositories";
import { PostProps } from "@domain/entities";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

export class GetAllPostsController extends Controller<any> {
  constructor(
    private readonly postRepository: IPostRepository,
    private readonly userRepository: IUserRepository,
  ) {
    super();
    this.schema = z.object({
      username: z.string().optional(),
    });
  }

  async run(request: HttpRequest<any>): Promise<PostProps[]> {
    const { username } = request.body;
    const { tags } = request.params;

    let userId: string | undefined;

    if (username) {
      const user = await this.userRepository.get({ username });

      if (user) {
        userId = user.id;
      }
    }

    if (userId && tags) {
      return await this.postRepository.getAll({
        userId,
        tags: Array.isArray(tags) && tags.length > 1 ? [...tags] : [tags],
      });
    } else if (userId) {
      return await this.postRepository.getAll({ userId });
    } else if (tags) {
      return await this.postRepository.getAll({
        tags: Array.isArray(tags) && tags.length > 1 ? [...tags] : [tags],
      });
    } else {
      return await this.postRepository.getAll();
    }
  }
}
