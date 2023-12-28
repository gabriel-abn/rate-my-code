import SignInUseCase from "@application/use-cases/sign-in-use-case";
import Hasher from "@infra/cryptography/hasher";
import JWTAdapter from "@infra/jwt/jwt-crypter";
import UserRepository from "@infra/repositories/user-repository";
import SignInController from "@presentation/controllers/sign-in-controller";
import express, { Request, Response, json } from "express";

const app = express();
const port = 3000;

app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/api/sign-in", async (req: Request, res: Response) => {
  const body = req.body;

  const useCase = new SignInUseCase(new UserRepository(), new Hasher(), new JWTAdapter());
  const controller = new SignInController(useCase);

  const response = await controller.handle({ body });

  res.status(response.statusCode).send({ ...response.body });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
