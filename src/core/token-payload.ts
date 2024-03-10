import { UserEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/user.entity';

export class TokenPayload {
  private constructor(
    private readonly id: string,
    private readonly email: string | null,
    private readonly phone: string | null,
    private readonly roles: string[],
  ) {}

  static fromUser(user: UserEntity): TokenPayload {
    return new TokenPayload(
      user.id,
      user.email,
      user.phone,
      user.roles.map((role) => role.toString()),
    );
  }
}
