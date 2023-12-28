namespace SignIn {
  type Params = {
    email: string;
    password: string;
  };

  type Result = {
    accessToken: string;
  };

  export interface UseCase {
    execute(data: Params): Promise<Result>;
  }
}

export default SignIn;
