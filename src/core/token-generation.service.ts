import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { TokenService } from 'src/core/ports/token.service';
import { TokenPayload } from 'src/core/token-payload';
import { UserEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/user.entity';
import { RefreshSessionRepository } from 'src/infra/persistence/postgresql/sequelize-orm/repositories/refresh-session.repository';

export class AccessRefreshTokenPair {
  constructor(
    public readonly accessToken: string,
    public readonly refreshToken: string,
  ) {}
}

@Injectable()
export class TokenGenerationService {
  private readonly refreshTokenExpiresInMs = 1000 * 60 * 60 * 24 * 30; // 30 days
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshSessionRepository,
  ) {}

  async generateTokenPair(user: UserEntity): Promise<AccessRefreshTokenPair> {
    const accessToken = await this.tokenService.generateToken(
      TokenPayload.fromUser(user),
    );

    const refreshTokenId = randomUUID();
    const refreshTokenExpiresAt = new Date(
      Date.now() + this.refreshTokenExpiresInMs,
    );
    const { refreshToken } = await this.refreshTokenRepository.create(
      user.id,
      refreshTokenId,
      refreshTokenExpiresAt,
    );

    return new AccessRefreshTokenPair(accessToken, refreshToken);
  }
}
