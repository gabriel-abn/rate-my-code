import { IDecrypter, IEncrypter } from "@application/protocols";

export default class JWTAdapter implements IEncrypter, IDecrypter {
  async encrypt(data: any): Promise<string> {
    return "any_token: " + data;
  }

  async decrypt(token: string): Promise<any> {
    return "any_data: " + token;
  }
}
