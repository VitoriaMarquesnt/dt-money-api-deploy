import { Injectable, NotFoundException } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';

@Injectable()
export class DeleteUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.delete(id);
  }
}
