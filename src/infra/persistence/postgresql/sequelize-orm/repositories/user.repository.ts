import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { Sequelize, Transaction, WhereOptions } from 'sequelize';
import { AlreadyExistsError } from 'src/core/errors/already-exists.error';
import { UserEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly userModel: typeof UserEntity,
    @InjectConnection()
    private readonly connection: Sequelize,
  ) {}

  async findOneByPhoneOrEmail(
    phone?: string | null,
    email?: string | null,
    transaction?: Transaction,
  ): Promise<UserEntity | null> {
    if (!email && !phone) {
      return null;
    }

    const where: WhereOptions<UserEntity> = {};

    if (email) {
      where.email = email;
    }

    if (phone) {
      where.phone = phone;
    }

    return this.userModel.findOne({ where, transaction });
  }

  async findExistingOrCreate(
    email: string | null,
    phone: string | null,
    passwordHash: string,
  ): Promise<UserEntity | AlreadyExistsError> {
    return await this.connection.transaction(async (transaction) => {
      const user = await this.findOneByPhoneOrEmail(phone, email, transaction);

      if (user) {
        return new AlreadyExistsError(
          'Пользователь с таким email или телефоном уже существует',
        );
      }

      return this.userModel.create(
        {
          email,
          phone,
          passwordHash,
        },
        { transaction },
      );
    });
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.userModel.findOne({ where: { email } });
  }
}
