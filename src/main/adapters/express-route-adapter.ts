import { Controller } from "@presentation/common";
import { HttpRequest } from "@presentation/common/http";

import { Request, Response } from "express";

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest<any> = {
      body: { ...req.body } || {},
      params: { ...req.params } || {},
      query: { ...req.query } || {},
      headers:
        "userId" in req.headers
          ? {
              userId: req.headers["userId"],
            }
          : null,
    };

    const httpResponse = await controller.handle(httpRequest);

    res.status(httpResponse.statusCode).send(httpResponse.body);
  };
};
