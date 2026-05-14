import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../../../shared/prisma.service';
import {
  IUser,
  ICreateUserParams,
  IUpdateUserParams,
  IUserRepository,
} from '../user.repository.abstract';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: ICreateUserParams): Promise<IUser> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
      },
    });

    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return user || null;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    return user || null;
  }

  async findByUsername(username: string): Promise<IUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    return user || null;
  }

  async findAll(): Promise<IUser[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async update(id: string, data: IUpdateUserParams): Promise<IUser> {
    const updateData: any = {};

    if (data.username) {
      updateData.username = data.username;
    }

    if (data.email) {
      updateData.email = data.email;
    }

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });

    return user;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
