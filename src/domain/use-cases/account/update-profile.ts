export namespace UpdateProfile {
  export type Params = {
    userId: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
  };

  export type Result = {
    updated: boolean;
  };

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
