import { Entity } from "@domain/common/entity";

export type FeedbackProps = {
  userId: string;
  postId: string;
  content: string;
  rating: number;
  rates: number;
};

export class Feedback extends Entity<FeedbackProps> {
  constructor(props: Omit<FeedbackProps, "rating" | "rates">, id: string) {
    super(
      {
        rating: 0,
        rates: 0,
        ...props,
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

  get rates() {
    return this.props.rates;
  }

  set rates(rates: number) {
    this.props.rates = rates;
  }

  static restore(props: FeedbackProps, id: string) {
    return new Feedback(props, id);
  }
}
