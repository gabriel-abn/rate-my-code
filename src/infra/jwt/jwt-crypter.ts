import { IDecrypter, IEncrypter } from "@application/protocols";

import { decode, sign } from "jsonwebtoken";

class JWTAdapter implements IEncrypter, IDecrypter {
  constructor(private readonly secret: string) {
    this.secret = secret;
  }

  encrypt(data: any): string {
    return sign(data, this.secret);
  }

  decrypt(token: string): any {
    return decode(token);
  }
}

export default new JWTAdapter(process.env.SECRET_KEY);
