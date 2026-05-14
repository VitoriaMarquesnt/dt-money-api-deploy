import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FindUserByEmailService } from './find-user-by-email.service';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';

describe('FindUserByEmailService', () => {
  let service: FindUserByEmailService;
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
        FindUserByEmailService,
        {
          provide: IUserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FindUserByEmailService>(FindUserByEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user by email', async () => {
    mockRepository.findByEmail.mockResolvedValueOnce(mockUser);

    const result = await service.execute('test@example.com');

    expect(result).toEqual(mockUser);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith('test@example.com');
  });

  it('should throw NotFoundException if user not found', async () => {
    mockRepository.findByEmail.mockResolvedValueOnce(null);

    await expect(service.execute('notfound@example.com')).rejects.toThrow(
      NotFoundException,
    );
  });
});
