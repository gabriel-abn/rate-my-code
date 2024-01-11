export namespace MakePost {
  export type Params = {
    title: string;
    content: string;
    tags: string[];
    userId: string;
  };

  export type Result = {
    id: string;
  };

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
