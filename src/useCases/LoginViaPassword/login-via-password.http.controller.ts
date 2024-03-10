import {
  Body,
  Controller,
  Logger,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import {
  LoginViaPasswordRequestDto,
  LoginViaPasswordResponseDto,
} from 'src/useCases/LoginViaPassword/login-via-password.dto';
import { LoginViaPasswordUseCase } from 'src/useCases/LoginViaPassword/login-via-password.usecase';

@Controller('login-via-password')
export class LoginViaPasswordHttpController {
  private readonly logger = new Logger(LoginViaPasswordHttpController.name);
  constructor(
    private readonly loginViaPasswordUseCase: LoginViaPasswordUseCase,
  ) {}

  @Post()
  async loginViaPassword(
    @Body() dto: LoginViaPasswordRequestDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginViaPasswordResponseDto> {
    const result = await this.loginViaPasswordUseCase.execute(dto);

    if (result instanceof Error) {
      this.logger.log(result.message);
      throw new UnauthorizedException();
    }

    response.cookie('sid', result.refreshToken);

    return { accessToken: result.accessToken };
  }
}
