import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { UpdateUserDTO } from '../dto';
import { IUser } from '../infra/repositories/user.repository.abstract';

@Injectable()
export class UpdateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<IUser> {
    const userExists = await this.userRepository.findById(id);

    if (!userExists) {
      throw new NotFoundException('User not found');
    }

    if (data.email && data.email !== userExists.email) {
      const emailTaken = await this.userRepository.findByEmail(data.email);
      if (emailTaken) {
        throw new BadRequestException('Email already taken');
      }
    }

    const updatedUser = await this.userRepository.update(id, data);

    return updatedUser;
  }
}
