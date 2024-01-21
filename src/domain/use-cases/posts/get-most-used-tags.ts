export namespace GetMostUsedTags {
  export type Params = {
    limit?: number;
  };

  export type Result = {
    tags: string[];
  };
  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
