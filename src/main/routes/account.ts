import { adaptRoute } from "@main/adapters/express-route-adapter";
import getProfileFactory from "@main/factories/account/get-profile-factory";
import loginFactory from "@main/factories/account/login-factory";
import signInFactory from "@main/factories/account/sign-in-factory";
import updateProfileFactory from "@main/factories/account/update-profile-factory";
import verifyEmailFactory from "@main/factories/account/verify-email-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";

import { Router } from "express";

const routes = Router();

routes.post("/sign-in", adaptRoute(signInFactory.create()));

routes.post("/verify-email", adaptRoute(verifyEmailFactory.create()));

routes.post("/login", adaptRoute(loginFactory.create()));

routes.put("/profile", authMiddleware(), adaptRoute(updateProfileFactory.create()));

routes.get("/profile", authMiddleware(), adaptRoute(getProfileFactory.create()));

const accountRoutes = Router().use("/account", routes);

export default accountRoutes;
