import { IHasher } from "@application/protocols";

import * as bcrypt from "bcrypt";

export default class Hasher implements IHasher {
  async hash(value: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(value, salt);

    return hash;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);

    return isValid;
  }
}
