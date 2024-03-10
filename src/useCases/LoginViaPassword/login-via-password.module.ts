import { Module } from '@nestjs/common';
import { HashingService } from 'src/core/ports/hashing.service';
import { TokenService } from 'src/core/ports/token.service';
import { TokenGenerationService } from 'src/core/token-generation.service';
import { BcryptHashingService } from 'src/infra/adapters/bcrypt-hashing.service';
import { JwtTokenService } from 'src/infra/adapters/jwt-token.service';
import { SequelizeOrmPersistenceModule } from 'src/infra/persistence/postgresql/sequelize-orm/sequelize-orm-persistence.module';
import { LoginViaPasswordHttpController } from 'src/useCases/LoginViaPassword/login-via-password.http.controller';
import { LoginViaPasswordUseCase } from 'src/useCases/LoginViaPassword/login-via-password.usecase';

@Module({
  imports: [SequelizeOrmPersistenceModule],
  controllers: [LoginViaPasswordHttpController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptHashingService,
    },
    {
      provide: TokenService,
      useClass: JwtTokenService,
    },
    LoginViaPasswordUseCase,
    TokenGenerationService,
  ],
})
export class LoginViaPasswordModule {}
