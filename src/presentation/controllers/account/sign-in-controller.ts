import { SignIn } from "@domain/use-cases";
import Controller from "@presentation/common/controller";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(64, "Password must be at most 64 characters.")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter.")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter.")
    .regex(/^(?=.*[0-9])/, "Password must contain at least one number.")
    .regex(/^(?=.*[!@#$%^&*])/, "Password must contain at least one special character."),
});

type SignInRequest = z.infer<typeof signInSchema>;

export class SignInController extends Controller<SignInRequest> {
  constructor(private readonly useCase: SignIn.UseCase) {
    super();
    this.schema = signInSchema;
  }

  async run(request: SignInRequest): Promise<object> {
    const response = await this.useCase.execute({
      email: request.email,
      password: request.password,
    });

    return response;
  }
}
