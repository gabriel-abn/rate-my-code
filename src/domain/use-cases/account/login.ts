export namespace Login {
  export type Params = {
    email: string;
    password: string;
  };
  export type Result = {
    accessToken: string;
    refreshToken: string;
  };
  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
