import { adaptRoute } from "@main/adapters/express-route-adapter";
import signInFactory from "@main/factories/account/sign-in-factory";
import verifyEmailFactory from "@main/factories/account/verify-email-factory";

import { Router } from "express";

export const accountRoutes = Router();

accountRoutes.post("/sign-in", adaptRoute(signInFactory.create()));

accountRoutes.post("/verify-email", adaptRoute(verifyEmailFactory.create()));
