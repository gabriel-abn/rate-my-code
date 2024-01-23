import { VerifyEmail } from "@domain/use-cases";
import { Controller, HttpRequest } from "@presentation/common";
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

  async run(request: HttpRequest<VerifyEmailRequest>): Promise<VerifyEmail.Result> {
    try {
      const { email, token } = request.body;

      return await this.useCase.execute({ email, token });
    } catch (error) {
      if (error.name === "EMAIL_ALREADY_VERIFIED") {
        return {
          isVerified: true,
          message: error.name,
        };
      }

      throw error;
    }
  }
}
