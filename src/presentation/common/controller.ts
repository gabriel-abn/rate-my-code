import ApplicationError from "@application/common/application-error";

import { Schema } from "zod";

import { HttpRequest, HttpResponse, badRequest, serverError, success } from "./http";

export abstract class Controller<T = any> {
  schema: Schema;

  abstract run(request: HttpRequest<T>): Promise<any>;

  async handle(request: HttpRequest<any>): Promise<HttpResponse> {
    try {
      const body = this.schema.safeParse(request.body);

      if (body.success == false) {
        const errors = body.error.issues.map((issue) => {
          return {
            path: issue.path[0],
            message: issue.message,
          };
        });

        return badRequest({
          error: "INVALID_REQUEST_BODY",
          expected: errors,
        });
      }

      const response = await this.run(request);

      return success(response);
    } catch (err) {
      if (err instanceof ApplicationError) {
        return badRequest({
          error: err.name,
          message: err.message,
        });
      }

      return serverError({
        error: "Unexpected error.",
        message: "An unexpected error occurred. " + err.message + "\n" + err.stack,
      });
    }
  }
}
