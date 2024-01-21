import { UserProps } from "@domain/entities";

export namespace GetUser {
  export type Params = {
    userId: string;
  };

  export type Result = UserProps & { feedbacks: number; rating: number };

  export interface UseCase {
    execute: (params: Params) => Promise<Result>;
  }
}
