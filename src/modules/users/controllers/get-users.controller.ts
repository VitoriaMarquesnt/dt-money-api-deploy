import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { GetUsersService } from '../services';
import { IUser } from '../infra/repositories/user.repository.abstract';

@ApiTags('users')
@Controller('users')
export class GetUsersController {
  constructor(private getUsersService: GetUsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string' },
        },
      },
    },
  })
  async execute(): Promise<IUser[]> {
    return this.getUsersService.execute();
  }
}
