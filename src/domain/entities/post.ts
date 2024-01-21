import { Entity } from "@domain/common/entity";

export type PostProps = {
  title: string;
  content: string;
  tags: string[];
  userId: string;
  feedbacks?: number;
};

export class Post extends Entity<PostProps> {
  constructor(props: PostProps, id: string) {
    super(props, id);
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get tags(): string[] {
    return this.props.tags;
  }

  get userId(): string {
    return this.props.userId;
  }

  set title(title: string) {
    this.props.title = title;
  }

  set content(content: string) {
    this.props.content = content;
  }

  set tags(tags: string[]) {
    this.props.tags = tags;
  }

  static restore(props: PostProps, id: string): Post {
    return new Post(props, id);
  }
}
