export default class ApplicationError extends Error {
  constructor(message: string, name?: string) {
    super();
    this.name = "ApplicationError" || name;
    this.message = message;
  }
}
