import { Login } from "@domain/use-cases";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

export const schema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email format."),
  password: z
    .string({
      required_error: "Valid password is required.",
    })
    .min(8, "Valid password is required."),
});

export type LoginRequest = z.infer<typeof schema>;

export class LoginController extends Controller<LoginRequest> {
  constructor(private readonly useCase: Login.UseCase) {
    super();
    this.schema = schema;
  }

  async run(request: HttpRequest<LoginRequest>): Promise<Login.Result> {
    const { email, password } = request.body;

    return await this.useCase.execute({ email, password });
  }
}
