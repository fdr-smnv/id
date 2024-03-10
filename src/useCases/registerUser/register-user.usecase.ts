import { Injectable } from '@nestjs/common';
import { AlreadyExistsError } from 'src/core/errors/already-exists.error';
import { HashingService } from 'src/core/ports/hashing.service';
import {
  AccessRefreshTokenPair,
  TokenGenerationService,
} from 'src/core/token-generation.service';
import { UserRepository } from 'src/infra/persistence/postgresql/sequelize-orm/repositories/user.repository';

export class RegisterUserCommand {
  constructor(
    public readonly email: string | null,
    public readonly phone: string | null,
    public readonly validPassword: string,
  ) {}
}

export class PhoneOrEmailIsRequiredError extends Error {
  constructor() {
    super('Телефон или email должны быть заполнены');
    this.name = 'PhoneOrEmailIsRequiredError';
  }
}

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashingService: HashingService,
    private readonly tokenGenerationService: TokenGenerationService,
  ) {}

  async execute(
    command: RegisterUserCommand,
  ): Promise<
    AccessRefreshTokenPair | PhoneOrEmailIsRequiredError | AlreadyExistsError
  > {
    if (!command.email && !command.phone) {
      return new PhoneOrEmailIsRequiredError();
    }

    const passwordHash = await this.hashingService.hash(command.validPassword);
    const userOrError = await this.userRepository.findExistingOrCreate(
      command.email,
      command.phone,
      passwordHash,
    );

    if (userOrError instanceof AlreadyExistsError) {
      return userOrError;
    }

    return this.tokenGenerationService.generateTokenPair(userOrError);
  }
}
