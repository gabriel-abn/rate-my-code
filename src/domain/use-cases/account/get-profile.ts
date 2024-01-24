import { UserProps } from "@domain/entities";

export namespace GetProfile {
  export type Params = {
    id: string;
  };

  export type Result = UserProps;

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
