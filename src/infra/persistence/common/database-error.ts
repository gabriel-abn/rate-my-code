import ApplicationError from "@application/common/application-error";

export class DatabaseError extends ApplicationError {
  constructor(message: string, error?: Error) {
    super(message, error?.name);
  }
}
