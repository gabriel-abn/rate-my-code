export default interface IUserRepository {
  save(user: User): Promise<User>;
  getById(id: string): Promise<User>;
  update(id: string, user: User): Promise<User>;
}
