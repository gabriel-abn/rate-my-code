export namespace SignIn {
  export type Params = {
    email: string;
    password: string;
  };

  export type Result = {
    accessToken: string;
  };

  export interface UseCase {
    execute(data: Params): Promise<Result>;
  }
}
