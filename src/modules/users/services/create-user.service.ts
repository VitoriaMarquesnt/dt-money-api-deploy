import { Injectable, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { CreateUserDTO } from '../dto';
import { IUser } from '../infra/repositories/user.repository.abstract';

@Injectable()
export class CreateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<IUser> {
    const userAlreadyExists = await this.userRepository.findByEmail(data.email);

    if (userAlreadyExists) {
      throw new BadRequestException('User with this email already exists');
    }

    const usernameTaken = await this.userRepository.findByUsername(data.username);

    if (usernameTaken) {
      throw new BadRequestException('Username already taken');
    }

    const user = await this.userRepository.create({
      username: data.username,
      email: data.email,
      password: data.password,
    });

    return user;
  }
}
