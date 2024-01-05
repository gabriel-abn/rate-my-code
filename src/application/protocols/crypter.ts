export interface IEncrypter {
  encrypt(data: any): string;
}

export interface IDecrypter {
  decrypt(token: string): any;
}
