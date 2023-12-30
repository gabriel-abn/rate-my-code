import { adaptRoute } from "@main/adapters/express-route-adapter";
import signInFactory from "@main/factories/account/sign-in-factory";

import { Router } from "express";

export const accountRoutes = Router();

accountRoutes.post("/sign-in", adaptRoute(signInFactory.create()));
