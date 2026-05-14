import {
  Controller,
  Put,
  Param,
  Body,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { UpdateUserService } from '../services';
import { UpdateUserDTO } from '../dto';
import { IUser } from '../infra/repositories/user.repository.abstract';

@ApiTags('users')
@Controller('users')
export class UpdateUserController {
  constructor(private updateUserService: UpdateUserService) {}

  @Put(':id')
  @HttpCode(200)
  @ApiOperation({ summary: 'Update a user' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'string' })
  @ApiBody({ type: UpdateUserDTO })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' },
        email: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async execute(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDTO: UpdateUserDTO,
  ): Promise<IUser> {
    return this.updateUserService.execute(id, updateUserDTO);
  }
}
