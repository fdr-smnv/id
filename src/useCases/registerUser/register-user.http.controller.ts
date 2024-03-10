import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AlreadyExistsError } from 'src/core/errors/already-exists.error';
import {
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from 'src/useCases/registerUser/register-user.dto';
import {
  PhoneOrEmailIsRequiredError,
  RegisterUserCommand,
  RegisterUserUseCase,
} from 'src/useCases/registerUser/register-user.usecase';

@Controller('register-user')
export class RegisterUserHttpController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Post()
  async registerUser(
    @Body() dto: RegisterUserRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RegisterUserResponseDto> {
    const result = await this.registerUserUseCase.execute(
      new RegisterUserCommand(dto.email, dto.phone, dto.password),
    );

    if (result instanceof PhoneOrEmailIsRequiredError) {
      throw new BadRequestException(result.message);
    }

    if (result instanceof AlreadyExistsError) {
      throw new BadRequestException(result.message);
    }

    // TODO: cookie options
    response.cookie('sid', result.refreshToken);

    return { accessToken: result.accessToken };
  }
}
