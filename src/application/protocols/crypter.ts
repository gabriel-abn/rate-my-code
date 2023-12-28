export interface IEncrypter {
  encrypt(data: any): Promise<string>;
}

export interface IDecrypter {
  decrypt(token: string): Promise<any>;
}
