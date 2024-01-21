export namespace UpdateProfile {
  export type Params = {
    userId: string;
    firstName: string;
    lastName?: string;
    avatar?: string;
    tags?: string[];
  };

  export type Result = boolean;

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
