namespace SignIn {
  export interface Params {
    email: string;
    password: string;
  }

  export interface Result {
    accessToken: string;
  }

  export interface UseCase {
    execute(data: Params): Promise<Result>;
  }
}

export default SignIn;
