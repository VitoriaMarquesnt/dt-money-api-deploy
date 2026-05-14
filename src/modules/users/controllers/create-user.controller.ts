import {
  Controller,
  Post,
  Body,
  HttpCode,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CreateUserService } from '../services';
import { CreateUserDTO } from '../dto';
import { IUser } from '../infra/repositories/user.repository.abstract';

@ApiTags('users')
@Controller('users')
export class CreateUserController {
  constructor(private createUserService: CreateUserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDTO })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
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
  async execute(
    @Body(ValidationPipe) createUserDTO: CreateUserDTO,
  ): Promise<IUser> {
    return this.createUserService.execute(createUserDTO);
  }
}
