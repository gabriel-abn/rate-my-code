import { IPostRepository } from "@application/repositories";
import { PostProps } from "@domain/entities";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

export class GetAllPostsController extends Controller<any> {
  constructor(private postRepository: IPostRepository) {
    super();
    this.schema = z.object({});
  }

  async run(request: HttpRequest<any>): Promise<PostProps[]> {
    const { tags } = request.params;
    let result: PostProps[] = [];

    if (tags) {
      result = await this.postRepository.getAll({
        tags: Array.isArray(tags) && tags.length > 1 ? [...tags] : [tags],
      });
    }

    return result;
  }
}
