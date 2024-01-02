export default class ApplicationError extends Error {
  constructor(message: string, name: string) {
    super();
    this.name = name ? name : "APPLICATION_ERROR";
    this.message = message;
  }
}
