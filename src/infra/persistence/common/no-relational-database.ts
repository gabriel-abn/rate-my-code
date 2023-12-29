export interface NoRelationalDatabase {
  save(data: any): Promise<string>;
  getById(id: string): Promise<any>;
  update(id: string, data: any): Promise<any>;
  delete(id: string): Promise<void>;
}
