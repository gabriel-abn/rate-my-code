import { EditPost } from "@domain/use-cases/posts";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
  title: z.string().min(3).max(255).optional(),
  content: z.string().min(10).max(10000).optional(),
  tags: z.array(z.string()).max(10).optional(),
});

export type EditPostRequest = z.infer<typeof schema>;

export class EditPostController extends Controller<EditPostRequest> {
  constructor(private readonly useCase: EditPost.UseCase) {
    super();
    this.schema = schema;
  }

  async run(request: HttpRequest<EditPostRequest>): Promise<{ id: string }> {
    const { id, title, content, tags } = request.body;

    const post = await this.useCase.execute({
      id,
      title,
      content,
      tags,
    });

    return {
      id: post.id,
    };
  }
}
