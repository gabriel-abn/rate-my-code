import { IPostRepository } from "@application/repositories";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

export class GetAllTagsController extends Controller {
  constructor(private readonly postRepository: IPostRepository) {
    super();
    this.schema = z.object({});
  }

  async run(request: HttpRequest<null>): Promise<string[]> {
    const { limit, page } = request.params;

    const result = await this.postRepository.listTags();

    if (limit && page) {
      return result.slice((page - 1) * limit, page * limit);
    }

    return result;
  }
}
