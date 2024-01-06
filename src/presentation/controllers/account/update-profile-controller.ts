import { UpdateProfile } from "@domain/use-cases";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

export const schema = z.object({
  id: z.string(),
  firstName: z.string().min(3).max(255),
  lastName: z.string().min(3).max(255).optional(),
  avatar: z.string().url().optional(),
});

export type UpdateProfileRequest = z.infer<typeof schema>;

export class UpdateProfileController extends Controller<UpdateProfileRequest> {
  constructor(private useCase: UpdateProfile.UseCase) {
    super();
    this.schema = schema;
  }

  async run(request: HttpRequest<UpdateProfileRequest>): Promise<{ updated: boolean }> {
    const { firstName, lastName, avatar, id: userId } = request.body;

    const response = await this.useCase.execute({
      userId,
      firstName,
      lastName,
      avatar,
    });

    return {
      updated: response,
    };
  }
}
