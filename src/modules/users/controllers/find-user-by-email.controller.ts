import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { FindUserByEmailService } from '../services';
import { IUser } from '../infra/repositories/user.repository.abstract';

@ApiTags('users')
@Controller('users')
export class FindUserByEmailController {
  constructor(private findUserByEmailService: FindUserByEmailService) {}

  @Get('find/email')
  @ApiOperation({ summary: 'Find user by email' })
  @ApiQuery({ name: 'email', description: 'User email', type: 'string' })
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
  async execute(@Query('email') email: string): Promise<IUser> {
    return this.findUserByEmailService.execute(email);
  }
}
