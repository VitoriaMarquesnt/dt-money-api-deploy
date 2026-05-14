import { Controller, Delete, Param, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DeleteUserService } from '../services';

@ApiTags('users')
@Controller('users')
export class DeleteUserController {
  constructor(private deleteUserService: DeleteUserService) {}

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async execute(@Param('id') id: string): Promise<void> {
    return this.deleteUserService.execute(id);
  }
}
