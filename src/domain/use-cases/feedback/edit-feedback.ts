export namespace EditFeedback {
  export type Params = {
    id: string;
    content: string;
  };

  export type Result = boolean;

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
