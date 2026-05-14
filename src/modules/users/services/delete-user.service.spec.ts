import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { DeleteUserService } from './delete-user.service';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';

describe('DeleteUserService', () => {
  let service: DeleteUserService;
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
        DeleteUserService,
        {
          provide: IUserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DeleteUserService>(DeleteUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should delete a user successfully', async () => {
    mockRepository.findById.mockResolvedValueOnce(mockUser);
    mockRepository.delete.mockResolvedValueOnce(undefined);

    await service.execute('1');

    expect(mockRepository.findById).toHaveBeenCalledWith('1');
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });

  it('should throw NotFoundException if user does not exist', async () => {
    mockRepository.findById.mockResolvedValueOnce(null);

    await expect(service.execute('invalid-id')).rejects.toThrow(
      NotFoundException,
    );
    expect(mockRepository.delete).not.toHaveBeenCalled();
  });
});
