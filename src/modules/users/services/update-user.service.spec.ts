import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UpdateUserService } from './update-user.service';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { UpdateUserDTO } from '../dto';

describe('UpdateUserService', () => {
  let service: UpdateUserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
  };

  const updateUserDTO: UpdateUserDTO = {
    username: 'newusername',
    email: 'newemail@example.com',
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: IUserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update a user successfully', async () => {
    const updatedUser = { ...mockUser, ...updateUserDTO };

    mockRepository.findById.mockResolvedValueOnce(mockUser);
    mockRepository.findByEmail.mockResolvedValueOnce(null);
    mockRepository.update.mockResolvedValueOnce(updatedUser);

    const result = await service.execute('1', updateUserDTO);

    expect(result).toEqual(updatedUser);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
    expect(mockRepository.update).toHaveBeenCalledWith('1', updateUserDTO);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockRepository.findById.mockResolvedValueOnce(null);

    await expect(service.execute('invalid-id', updateUserDTO)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException if new email already taken', async () => {
    const anotherUser = {
      id: '2',
      username: 'anotheruser',
      email: 'newemail@example.com',
      password: 'hashedPassword456',
    };

    mockRepository.findById.mockResolvedValueOnce(mockUser);
    mockRepository.findByEmail.mockResolvedValueOnce(anotherUser);

    await expect(service.execute('1', updateUserDTO)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockRepository.update).not.toHaveBeenCalled();
  });

  it('should update user without checking email if email is not changed', async () => {
    const updateWithoutEmail: UpdateUserDTO = {
      username: 'newusername',
    };

    mockRepository.findById.mockResolvedValueOnce(mockUser);
    mockRepository.update.mockResolvedValueOnce({
      ...mockUser,
      ...updateWithoutEmail,
    });

    await service.execute('1', updateWithoutEmail);

    expect(mockRepository.findByEmail).not.toHaveBeenCalled();
  });
});
