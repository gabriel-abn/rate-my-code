import jwtCrypter from "@infra/jwt/jwt-crypter";
import redisDb from "@infra/persistence/database/redis-db";

import { adaptRoute } from "@main/adapters/express-route-adapter";
import loginFactory from "@main/factories/account/login-factory";
import signInFactory from "@main/factories/account/sign-in-factory";
import updateProfileFactory from "@main/factories/account/update-profile-factory";
import verifyEmailFactory from "@main/factories/account/verify-email-factory";
import { authMiddleware } from "@main/middlewares/auth-middleware";

import { NextFunction, Request, Response, Router } from "express";

export const accountRoutes = Router();

accountRoutes.post("/sign-in", adaptRoute(signInFactory.create()));

accountRoutes.post(
  "/verify-email",
  async (req: Request, res: Response, next: NextFunction) => {
    let accessToken: string[] | undefined;
    try {
      try {
        accessToken = req.headers.authorization?.split(" ");

        if (!accessToken || !accessToken[1]) {
          return res.status(401).json({
            error: "UNAUTHORIZED",
            message: "You need to login to perform this action",
          });
        }
      } catch (error) {
        return res
          .status(402)
          .json({ error: "UNAUTHORIZED", message: "No token provided." });
      }

      try {
        const { email } = jwtCrypter.decrypt(accessToken[1]);

        const userId = await redisDb.exists(email);

        if (!userId) {
          return res.status(401).json({
            error: "UNAUTHORIZED",
            message: "You need to login to perform this action",
          });
        }

        next();
      } catch (error) {
        return res
          .status(404)
          .json({ error: "AUTHENTICATION_ERROR", message: "Invalid token." });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ error: "AUTHENTICATION_ERROR", message: error.message });
    }
  },
  adaptRoute(verifyEmailFactory.create()),
);

accountRoutes.post("/login", adaptRoute(loginFactory.create()));

accountRoutes.put(
  "/update-profile",
  authMiddleware(),
  adaptRoute(updateProfileFactory.create()),
);
