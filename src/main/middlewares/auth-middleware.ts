import jwtCrypter from "@infra/jwt/jwt-crypter";

import { NextFunction, Request, Response } from "express";

export const authMiddleware = (permission?: number) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let accessToken: string[] | undefined;

    try {
      // "Bearer TOKEN"
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
        .json({ error: "UNAUTHENTICADED", message: "No token provided." });
    }

    try {
      const { id, role } = jwtCrypter.decrypt(accessToken[1]);

      if (permission) {
        if (role > permission) {
          return res.status(403).json({
            error: "UNAUTHORIZED",
            message: "You don't have permission to perform this action",
          });
        }

        next();
      }

      req.body = { ...req.body, id };

      next();
    } catch (error) {
      return res
        .status(404)
        .json({ error: "AUTHENTICATION_ERROR", message: "Invalid token." });
    }
  };
};
