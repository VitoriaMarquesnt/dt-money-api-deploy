export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface ICreateUserParams {
  username: string;
  email: string;
  password: string;
}

export interface IUpdateUserParams {
  username?: string;
  email?: string;
  password?: string;
}

export abstract class IUserRepository {
  abstract create(data: ICreateUserParams): Promise<IUser>;
  abstract findById(id: string): Promise<IUser | null>;
  abstract findByEmail(email: string): Promise<IUser | null>;
  abstract findByUsername(username: string): Promise<IUser | null>;
  abstract findAll(): Promise<IUser[]>;
  abstract update(id: string, data: IUpdateUserParams): Promise<IUser>;
  abstract delete(id: string): Promise<void>;
}
