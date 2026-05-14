import { Module } from '@nestjs/common';
import { PrismaService } from '../../shared/prisma.service';
import { IUserRepository } from './infra/repositories/user.repository.abstract';
import { PrismaUserRepository } from './infra/repositories/prisma/prisma.user.repository';
import {
  CreateUserService,
  FindUserByIdService,
  FindUserByEmailService,
  GetUsersService,
  UpdateUserService,
  DeleteUserService,
} from './services';
import {
  CreateUserController,
  FindUserByIdController,
  FindUserByEmailController,
  GetUsersController,
  UpdateUserController,
  DeleteUserController,
} from './controllers';

@Module({
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    CreateUserService,
    FindUserByIdService,
    FindUserByEmailService,
    GetUsersService,
    UpdateUserService,
    DeleteUserService,
  ],
  controllers: [
    CreateUserController,
    FindUserByIdController,
    FindUserByEmailController,
    GetUsersController,
    UpdateUserController,
    DeleteUserController,
  ],
})
export class UsersModule {}
