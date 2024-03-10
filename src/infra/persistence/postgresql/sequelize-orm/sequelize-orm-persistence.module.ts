import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { RefreshSessionEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/refresh-session.entity';
import { UserEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/user.entity';
import { RefreshSessionRepository } from 'src/infra/persistence/postgresql/sequelize-orm/repositories/refresh-session.repository';
import { UserRepository } from 'src/infra/persistence/postgresql/sequelize-orm/repositories/user.repository';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        database: configService.getOrThrow('POSTGRES_DB_NAME'),
        username: configService.getOrThrow('POSTGRES_USER'),
        password: configService.getOrThrow('POSTGRES_PASSWORD'),
        host: configService.getOrThrow('POSTGRES_HOST'),
        port: +configService.getOrThrow('POSTGRES_PORT'),
        type: 'postgres',
        models: [UserEntity, RefreshSessionEntity],
        dialect: 'postgres',
      }),
    }),
    SequelizeModule.forFeature([RefreshSessionEntity, UserEntity]),
  ],
  providers: [RefreshSessionRepository, UserRepository],
  exports: [RefreshSessionRepository, UserRepository],
})
export class SequelizeOrmPersistenceModule {}
