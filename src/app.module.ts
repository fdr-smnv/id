import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginViaPasswordModule } from 'src/useCases/LoginViaPassword/login-via-password.module';
import { RefreshTokenModule } from 'src/useCases/refreshToken/refresh-token.module';
import { RegisterUserModule } from 'src/useCases/registerUser/register-user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true, secret: 'secret' }),
    RegisterUserModule,
    LoginViaPasswordModule,
    RefreshTokenModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
