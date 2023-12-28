namespace SendEmail {
  type Params = {
    to: string;
    template: string;
    data: Record<string, any>;
  };

  type Result = boolean;

  export interface Service {
    send(data: Params): Promise<Result>;
  }
}

export default SendEmail;
