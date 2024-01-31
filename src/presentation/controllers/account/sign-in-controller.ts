import { SignIn } from "@domain/use-cases";
import { Controller, HttpRequest } from "@presentation/common";
import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email("Invalid email."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters.")
    .max(64, "Password must be at most 64 characters.")
    .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter.")
    .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter.")
    .regex(/^(?=.*[0-9])/, "Password must contain at least one number.")
    .regex(/^(?=.*[!@#$%^&*])/, "Password must contain at least one special character."),
  role: z.enum(["DEVELOPER", "INSTRUCTOR"], { invalid_type_error: "Invalid role." }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(32, "Username must be at most 32 characters."),
  tags: z.array(z.string()),
});

type SignInRequest = z.infer<typeof signInSchema>;

export class SignInController extends Controller<SignInRequest> {
  constructor(private readonly useCase: SignIn.UseCase) {
    super();
    this.schema = signInSchema;
  }

  async run(request: HttpRequest<SignInRequest>): Promise<object> {
    const { email, password, role, username, tags } = request.body;

    const response = await this.useCase.execute({
      email,
      password,
      role,
      username,
      tags,
    });

    return response;
  }
}
