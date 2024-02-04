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
    this.schema = z.object({});
  }

  async run(request: HttpRequest<any>): Promise<PostProps[]> {
    try {
      let posts: PostProps[] = [];

      const { username } = request.params;
      let { tags } = request.query;

      let userId: string | undefined;

      if (username) {
        const user = await this.userRepository.get({ username });

        if (user) {
          userId = user.id;
        }
      }

      if (tags) tags = Array.isArray(tags) ? tags : new Array(tags);

      if (userId && tags) {
        posts = await this.postRepository.getAll({
          tags,
          userId,
        });

        return posts;
      }

      if (userId) {
        posts = await this.postRepository.getAll({ userId });
      } else if (tags) {
        posts = await this.postRepository.getAll({ tags });
      } else {
        posts = await this.postRepository.getAll();
      }

      return posts;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
