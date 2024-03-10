import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshSessionEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/refresh-session.entity';
import { UserEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/user.entity';

@Injectable()
export class RefreshSessionRepository {
  constructor(
    @InjectModel(RefreshSessionEntity)
    private readonly refreshSessionModel: typeof RefreshSessionEntity,
  ) {}

  async create(userId: string, refreshToken: string, expiresAt: Date) {
    return this.refreshSessionModel.create({
      userId,
      refreshToken,
      expiresAt,
    });
  }

  async findByTokenWithUser(refreshToken: string) {
    return this.refreshSessionModel.findOne({
      where: {
        refreshToken,
      },
      include: [UserEntity],
    });
  }
}
