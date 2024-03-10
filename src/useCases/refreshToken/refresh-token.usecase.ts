import { Injectable } from '@nestjs/common';
import { TokenGenerationService } from 'src/core/token-generation.service';
import { RefreshSessionRepository } from 'src/infra/persistence/postgresql/sequelize-orm/repositories/refresh-session.repository';

export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}

export class RefreshTokenResult {
  constructor(
    public readonly refreshToken: string,
    public readonly accessToken: string,
  ) {}
}

export class SessionNotFoundError extends Error {
  constructor() {
    super('Cессия не найдена');
    this.name = 'SessionNotFoundError';
  }
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    private readonly refreshSessionRepository: RefreshSessionRepository,
    private readonly tokenGenerationService: TokenGenerationService,
  ) {}

  async execute(
    command: RefreshTokenCommand,
  ): Promise<RefreshTokenResult | SessionNotFoundError> {
    const storedRefreshToken =
      await this.refreshSessionRepository.findByTokenWithUser(
        command.refreshToken,
      );

    if (!storedRefreshToken) {
      return new SessionNotFoundError();
    }

    return this.tokenGenerationService.generateTokenPair(
      storedRefreshToken.user,
    );
  }
}
