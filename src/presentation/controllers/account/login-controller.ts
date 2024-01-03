import { Login } from "@domain/use-cases";
import Controller from "@presentation/common/controller";
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

  async run(request: LoginRequest): Promise<Login.Result> {
    const { email, password } = request;

    return await this.useCase.execute({ email, password });
  }
}
