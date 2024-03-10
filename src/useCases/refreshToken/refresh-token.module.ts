import { Module } from '@nestjs/common';
import { HashingService } from 'src/core/ports/hashing.service';
import { TokenService } from 'src/core/ports/token.service';
import { TokenGenerationService } from 'src/core/token-generation.service';
import { BcryptHashingService } from 'src/infra/adapters/bcrypt-hashing.service';
import { JwtTokenService } from 'src/infra/adapters/jwt-token.service';
import { SequelizeOrmPersistenceModule } from 'src/infra/persistence/postgresql/sequelize-orm/sequelize-orm-persistence.module';
import { RefreshTokenHttpController } from 'src/useCases/refreshToken/refresh-token.http.controller';
import { RefreshTokenUseCase } from 'src/useCases/refreshToken/refresh-token.usecase';

@Module({
  imports: [SequelizeOrmPersistenceModule],
  controllers: [RefreshTokenHttpController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
    RefreshTokenUseCase,
    TokenGenerationService,
  ],
})
export class RefreshTokenModule {}
