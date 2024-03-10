import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/core/ports/hashing.service';
import { TokenGenerationService } from 'src/core/token-generation.service';
import { UserRepository } from 'src/infra/persistence/postgresql/sequelize-orm/repositories/user.repository';

export class LoginViaPasswordCommand {
  constructor(
    public readonly password: string,
    public readonly email?: string,
    public readonly phone?: string,
  ) {}
}

export class LoginViaPasswordResult {
  constructor(
    public readonly refreshToken: string,
    public readonly accessToken: string,
  ) {}
}

export class UserNotFoundError extends Error {
  constructor() {
    super('Пользователь не найден');
    this.name = 'UserNotFoundError';
  }
}

export class InvalidPasswordError extends Error {
  constructor() {
    super('Неверный пароль');
    this.name = 'InvalidPasswordError';
  }
}
@Injectable()
export class LoginViaPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly tokenGenerationService: TokenGenerationService,
  ) {}

  async execute({
    phone,
    email,
    password,
  }: LoginViaPasswordCommand): Promise<
    LoginViaPasswordResult | UserNotFoundError | InvalidPasswordError
  > {
    const user = await this.userRepository.findOneByPhoneOrEmail(phone, email);

    if (!user) {
      return new UserNotFoundError();
    }

    const passwordIsValid = await this.hashingService.compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      return new InvalidPasswordError();
    }

    return this.tokenGenerationService.generateTokenPair(user);
  }
}
