export interface UseCase<Params, Result> {
  execute(data: Params): Promise<Result>;
}
