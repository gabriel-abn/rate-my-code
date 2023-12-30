import SignInUseCase from "@application/use-cases/sign-in-use-case";

import Hasher from "@infra/cryptography/hasher";
import JWTAdapter from "@infra/jwt/jwt-crypter";
import tokenRepository from "@infra/persistence/repositories/token-repository";
import userRepository from "@infra/persistence/repositories/user-repository";
import emailService from "@infra/services/email-service";

import SignInController from "@presentation/controllers/sign-in-controller";

import express, { Request, Response, json } from "express";
import loadEnvVars from "./config/env";

loadEnvVars();

const app = express();
const PORT = 3000;

app.use(json());

app.listen(PORT, () => {
  console.log(`Environment: ${process.env.NODE_ENV}\n`);
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, World!");
});

app.post("/api/sign-in", async (req: Request, res: Response) => {
  const body = req.body;

  const useCase = new SignInUseCase(
    userRepository,
    new Hasher(),
    new JWTAdapter(),
    tokenRepository,
    emailService,
  );

  const controller = new SignInController(useCase);

  const response = await controller.handle({ body });

  res.status(response.statusCode).send({ ...response.body });
});

export default app;
