import {
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RefreshTokenResponseDto } from 'src/useCases/refreshToken/refresh-token.dto';
import {
  RefreshTokenCommand,
  RefreshTokenUseCase,
} from 'src/useCases/refreshToken/refresh-token.usecase';

@Controller('refresh-token')
export class RefreshTokenHttpController {
  constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {}

  @Post()
  async refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RefreshTokenResponseDto> {
    const refreshToken: string | undefined = request.cookies['sid'];

    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    const result = await this.refreshTokenUseCase.execute(
      new RefreshTokenCommand(refreshToken),
    );

    if (result instanceof Error) {
      throw new UnauthorizedException();
    }

    response.cookie('sid', result.refreshToken);

    return { accessToken: result.accessToken };
  }
}
