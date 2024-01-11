export namespace EditPost {
  export type Params = {
    id: string;
    content: string;
    title: string;
    tags: string[];
  };

  export type Result = {
    id: string;
  };

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
