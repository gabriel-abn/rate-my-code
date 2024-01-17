export namespace RateFeedback {
  export type Params = {
    id: string;
    rating: number;
  };

  export type Result = {
    updatedRating: number;
  };

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
