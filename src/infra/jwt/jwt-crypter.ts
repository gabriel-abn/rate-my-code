import { IDecrypter, IEncrypter } from "@application/protocols";

import { decode, sign } from "jsonwebtoken";

class JWTAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }

  async encrypt(data: any): Promise<string> {
    return sign(data, this.secret);
  }

  async decrypt(token: string): Promise<any> {
    return decode(token);
  }
}

export default new JWTAdapter(process.env.SECRET_KEY);
