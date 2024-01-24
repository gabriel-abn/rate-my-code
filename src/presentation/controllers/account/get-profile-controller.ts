import { UserProps } from "@domain/entities";
import { GetProfile } from "@domain/use-cases";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

export class GetProfileController extends Controller {
  constructor(private readonly useCase: GetProfile.UseCase) {
    super();
    this.schema = z.object({});
  }

  async run(request: HttpRequest<null>): Promise<UserProps> {
    const { userId } = request.headers;

    const result = await this.useCase.execute({ id: userId });

    return result;
  }
}
