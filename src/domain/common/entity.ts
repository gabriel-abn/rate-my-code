export abstract class Entity<T> {
  protected readonly props: T;
  private readonly _id: string;

  constructor(props: T, id: string) {
    this.props = props;
    this._id = id;
  }

  equals(entity?: Entity<T>): boolean {
    if (entity === null || entity === undefined) {
      return false;
    }

    if (this === entity) {
      return true;
    }

    return this._id === entity._id;
  }

  get id(): string {
    return this._id;
  }

  getProps(): T {
    return this.props;
  }
}
