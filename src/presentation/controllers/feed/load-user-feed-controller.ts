import { GetMostUsedTags, LoadPosts } from "@domain/use-cases/posts";
import { GetUser } from "@domain/use-cases/user";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

export class LoadUserFeedController extends Controller {
  constructor(
    private readonly getUser: GetUser.UseCase,
    private readonly loadPosts: LoadPosts.UseCase,
    private readonly loadTags: GetMostUsedTags.UseCase,
  ) {
    super();
    this.schema = z.object({});
  }

  async run(request: HttpRequest<null>): Promise<object> {
    const { userId } = request.headers;

    const user = await this.getUser.execute({ userId });
    const userProfile = user.profile;

    const posts = await this.loadPosts.execute({ tags: user.tags });

    const { tags } = await this.loadTags.execute({ limit: 7 });

    return {
      posts: posts
        ? posts.map(({ post, author }) => ({
            author: {
              username: author.username,
              avatar: author.profile.avatar,
            },
            post: {
              content: post.content,
              feedbacks: post.feedbacks,
              tags: post.tags,
            },
          }))
        : [],
      user: {
        username: user.username,
        avatar: userProfile.avatar,
        feedbacks: user.feedbacks,
        rating: user.rating,
      },
      tags,
    };
  }
}
