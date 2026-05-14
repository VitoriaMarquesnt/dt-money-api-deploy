import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CreateUserService } from './create-user.service';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { CreateUserDTO } from '../dto';

describe('CreateUserService', () => {
  let service: CreateUserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUser = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword123',
  };

  const createUserDTO: CreateUserDTO = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findByUsername: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: IUserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CreateUserService>(CreateUserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user successfully', async () => {
    mockRepository.findByEmail.mockResolvedValueOnce(null);
    mockRepository.findByUsername.mockResolvedValueOnce(null);
    mockRepository.create.mockResolvedValueOnce(mockUser);

    const result = await service.execute(createUserDTO);

    expect(result).toEqual(mockUser);
    expect(mockRepository.findByEmail).toHaveBeenCalledWith(createUserDTO.email);
    expect(mockRepository.findByUsername).toHaveBeenCalledWith(createUserDTO.username);
    expect(mockRepository.create).toHaveBeenCalledWith({
      username: createUserDTO.username,
      email: createUserDTO.email,
      password: createUserDTO.password,
    });
  });

  it('should throw error if email already exists', async () => {
    mockRepository.findByEmail.mockResolvedValueOnce(mockUser);

    await expect(service.execute(createUserDTO)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockRepository.create).not.toHaveBeenCalled();
  });

  it('should throw error if username already taken', async () => {
    mockRepository.findByEmail.mockResolvedValueOnce(null);
    mockRepository.findByUsername.mockResolvedValueOnce(mockUser);

    await expect(service.execute(createUserDTO)).rejects.toThrow(
      BadRequestException,
    );
    expect(mockRepository.create).not.toHaveBeenCalled();
  });
});
