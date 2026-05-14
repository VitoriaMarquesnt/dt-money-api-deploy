import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { FindUserByIdService } from '../services';
import { IUser } from '../infra/repositories/user.repository.abstract';

@ApiTags('users')
@Controller('users')
export class FindUserByIdController {
  constructor(private findUserByIdService: FindUserByIdService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Find user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'User found successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async execute(@Param('id') id: string): Promise<IUser> {
    return this.findUserByIdService.execute(id);
  }
}
