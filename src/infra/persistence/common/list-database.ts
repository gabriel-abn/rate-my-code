export interface ListDatabase {
  getLists(pattern?: string): Promise<string[]>;
  getList(listName: string): Promise<string[]>;
  addToList(listName: string, ...value: string[]): Promise<void>;
  listSize(listName: string): Promise<number>;
  removeFromList(listName: string, ...value: string[]): Promise<void>;
  deleteList(listName: string): Promise<void>;
}
