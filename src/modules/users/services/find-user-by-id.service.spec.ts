import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindUserByIdService } from './find-user-by-id.service';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';

describe('FindUserByIdService', () => {
  let service: FindUserByIdService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
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
        FindUserByIdService,
        {
          provide: IUserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FindUserByIdService>(FindUserByIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user by id', async () => {
    mockRepository.findById.mockResolvedValueOnce(mockUser);

    const result = await service.execute('1');

    expect(result).toEqual(mockUser);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if user not found', async () => {
    mockRepository.findById.mockResolvedValueOnce(null);

    await expect(service.execute('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepository.findById).toHaveBeenCalledWith('invalid-id');
  });
});
