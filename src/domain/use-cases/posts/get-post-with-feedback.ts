import { FeedbackProps, PostProps } from "@domain/entities";

export namespace GetPostWithFeedback {
  export type Params = {
    id: string;
  };

  export type Result = {
    post: PostProps;
    feedback: FeedbackProps[];
  };

  export interface UseCase {
    execute(params: Params): Promise<Result>;
  }
}
