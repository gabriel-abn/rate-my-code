export namespace GiveFeedback {
  export type Params = {
    userId: string;
    postId: string;
    content: string;
  };

  export type Result = {
    id: string;
  };

  export interface UseCase {
    execute: (params: GiveFeedback.Params) => Promise<GiveFeedback.Result>;
  }
}
