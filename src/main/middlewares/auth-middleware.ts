import jwtCrypter from "@infra/jwt/jwt-crypter";

import { NextFunction, Request, Response } from "express";

export const authMiddleware = () => {
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
        .json({ error: "UNAUTHORIZED", message: "No token provided." });
    }

    try {
      const { email, id } = jwtCrypter.decrypt(accessToken[1]);

      req.body = { ...req.body, email, id };

      next();
    } catch (error) {
      return res
        .status(404)
        .json({ error: "AUTHENTICATION_ERROR", message: "Invalid token." });
    }
  };
};
