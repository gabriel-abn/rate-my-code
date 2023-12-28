import ApplicationError from "@application/common/application-error";
import { HttpRequest, HttpResponse, badRequest, serverError, success } from "./http";

import { Schema } from "zod";

export default abstract class Controller<T = any> {
  schema: Schema;
  abstract run(request: T): Promise<any>;

  async handle(request: HttpRequest): Promise<HttpResponse> {
    try {
      const body = this.schema.safeParse(request.body);

      if (body.success == false) {
        const bodyError = JSON.parse(body.error.message);

        return badRequest({
          error: "INVALID_REQUEST_BODY",
          message: bodyError[0].message,
        });
      }

      const response = await this.run(body.data);

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
