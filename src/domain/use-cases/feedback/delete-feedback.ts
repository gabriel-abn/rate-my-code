export namespace DeleteFeedback {
  export type Params = {
    id: string;
  };
  export type Result = boolean;

  export interface UseCase {
    execute: (params: Params) => Promise<Result>;
  }
}
