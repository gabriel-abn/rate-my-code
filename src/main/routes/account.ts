import { adaptRoute } from "@main/adapters/express-route-adapter";
import loginFactory from "@main/factories/account/login-factory";
import signInFactory from "@main/factories/account/sign-in-factory";
import updateProfileFactory from "@main/factories/account/update-profile-factory";
import verifyEmailFactory from "@main/factories/account/verify-email-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";

import { Router } from "express";

export const accountRoutes = Router();

accountRoutes.post("/sign-in", adaptRoute(signInFactory.create()));

accountRoutes.post(
  "/verify-email",
  authMiddleware(),
  adaptRoute(verifyEmailFactory.create()),
);

accountRoutes.post("/login", adaptRoute(loginFactory.create()));

accountRoutes.put(
  "/update-profile",
  authMiddleware(),
  adaptRoute(updateProfileFactory.create()),
);
