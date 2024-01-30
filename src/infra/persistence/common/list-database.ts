export interface ListDatabase {
  getLists(pattern?: string): Promise<string[]>;
  getList(listName: string): Promise<string[]>;
  addToList(listName: string, ...value: string[]): Promise<void>;
  removeFromList(listName: string, ...value: string[]): Promise<void>;
  deleteList(listName: string): Promise<void>;
}
