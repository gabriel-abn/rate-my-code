export namespace VerifyEmail {
  export type Params = {
    email: string;
    token: string;
  };

  export type Result = {
    isVerified: boolean;
    message: string;
  };

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
