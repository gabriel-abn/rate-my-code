import { Entity } from "@domain/common/entity";

export type FeedbackProps = {
  userId: string;
  postId: string;
  content: string;
  rating: number;
};

export class Feedback extends Entity<FeedbackProps> {
  constructor(props: Omit<FeedbackProps, "rating">, id: string) {
    super(
      {
        ...props,
        rating: 0,
      },
      id,
    );
  }

  set content(content: string) {
    this.props.content = content;
  }

  get content() {
    return this.props.content;
  }

  set rating(rating: number) {
    this.props.rating = rating;
  }

  get rating() {
    return this.props.rating;
  }

  static restore(props: FeedbackProps, id: string) {
    return new Feedback(props, id);
  }
}
