import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { IUser } from '../infra/repositories/user.repository.abstract';

@Injectable()
export class GetUsersService {
  constructor(private userRepository: IUserRepository) {}

  async execute(): Promise<IUser[]> {
    const users = await this.userRepository.findAll();
    return users;
  }
}
