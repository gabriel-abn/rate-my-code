import { DeletePost } from "@domain/use-cases/posts";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const schema = z.object({
  id: z.string(),
});

export type DeletePostRequest = z.infer<typeof schema>;

export class DeletePostController extends Controller<DeletePostRequest> {
  constructor(private readonly useCase: DeletePost.UseCase) {
    super();
    this.schema = schema;
  }

  async run(request: HttpRequest<DeletePostRequest>): Promise<{ deleted: boolean }> {
    const { id } = request.body;

    const deleted = await this.useCase.execute({
      id,
    });

    return {
      deleted,
    };
  }
}
