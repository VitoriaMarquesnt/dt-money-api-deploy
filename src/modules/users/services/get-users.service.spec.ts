import { Test, TestingModule } from '@nestjs/testing';
import { GetUsersService } from './get-users.service';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';

describe('GetUsersService', () => {
  let service: GetUsersService;
  let mockRepository: jest.Mocked<IUserRepository>;

  const mockUsers = [
    {
      id: '1',
      username: 'user1',
      email: 'user1@example.com',
      password: 'hashedPassword1',
    },
    {
      id: '2',
      username: 'user2',
      email: 'user2@example.com',
      password: 'hashedPassword2',
    },
  ];

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
        GetUsersService,
        {
          provide: IUserRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<GetUsersService>(GetUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    mockRepository.findAll.mockResolvedValueOnce(mockUsers);

    const result = await service.execute();

    expect(result).toEqual(mockUsers);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return empty array if no users exist', async () => {
    mockRepository.findAll.mockResolvedValueOnce([]);

    const result = await service.execute();

    expect(result).toEqual([]);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
