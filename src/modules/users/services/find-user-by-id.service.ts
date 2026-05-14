import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { IUser } from '../infra/repositories/user.repository.abstract';

@Injectable()
export class FindUserByIdService {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
