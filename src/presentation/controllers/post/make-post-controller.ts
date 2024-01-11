import { MakePost } from "@domain/use-cases/posts";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(3).max(255),
  content: z.string().min(10).max(10000),
  tags: z.array(z.string()).max(10),
  userId: z.string(),
});

export type MakePostRequest = z.infer<typeof schema>;

export class MakePostController extends Controller<MakePostRequest> {
  constructor(private readonly useCase: MakePost.UseCase) {
    super();
    this.schema = schema;
  }

  async run(request: HttpRequest<MakePostRequest>): Promise<{ id: string }> {
    const { title, content, userId, tags } = request.body;

    const post = await this.useCase.execute({
      title,
      content,
      tags,
      userId,
    });

    return {
      id: post.id,
    };
  }
}
