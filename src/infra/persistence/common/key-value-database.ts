export interface KeyValueDatabase {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string>;
  del(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
}
