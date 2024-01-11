import { IPostRepository } from "@application/repositories";
import { Post } from "@domain/entities";
import { Controller, HttpRequest } from "@presentation/common";

export class GetAllPostsController extends Controller<any> {
  constructor(private postRepository: IPostRepository) {
    super();
  }

  async run(request: HttpRequest<any>): Promise<Post[]> {
    const { userId, title, tags } = request.params;
    let result: Post[] = [];

    const posts = await this.postRepository.getAll();

    if (userId) {
      result = posts.filter((post) => post.userId === userId);
    }

    if (title) {
      result = posts.filter((post) => post.title.includes(title));
    }

    if (tags) {
      result = posts.filter((post) => post.tags.includes(tags));
    }

    return result;
  }
}
