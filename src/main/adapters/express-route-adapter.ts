import Controller from "@presentation/common/controller";
import { HttpRequest } from "@presentation/common/http";

import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body,
    };

    const httpResponse = await controller.handle(httpRequest);

    res.status(httpResponse.statusCode).send(httpResponse.body);
  };
};
