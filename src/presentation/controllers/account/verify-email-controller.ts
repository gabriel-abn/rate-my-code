import { VerifyEmail } from "@domain/use-cases";
import Controller from "@presentation/common/controller";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  token: z.string(),
});

export type VerifyEmailRequest = z.infer<typeof schema>;

export class VerifyEmailController extends Controller<VerifyEmailRequest> {
  constructor(private useCase: VerifyEmail.UseCase) {
    super();
    this.schema = schema;
  }

  async run(request: VerifyEmailRequest): Promise<VerifyEmail.Result> {
    const { email, token } = request;

    return await this.useCase.execute({ email, token });
  }
}
