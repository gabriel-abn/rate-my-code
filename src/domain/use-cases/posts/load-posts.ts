import { PostProps, UserProps } from "@domain/entities";

export namespace LoadPosts {
  export type Params = {
    tags?: string[];
  };

  export type Result = {
    post: PostProps;
    author: UserProps;
  }[];

  export interface UseCase {
    execute: (params: Params) => Promise<Result>;
  }
}
