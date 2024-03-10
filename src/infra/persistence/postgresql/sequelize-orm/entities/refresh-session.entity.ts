import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { UserEntity } from 'src/infra/persistence/postgresql/sequelize-orm/entities/user.entity';

@Table({
  tableName: 'refresh_sessions',
  createdAt: true,
  updatedAt: false,
  underscored: true,
})
export class RefreshSessionEntity extends Model<
  InferAttributes<RefreshSessionEntity>,
  InferCreationAttributes<RefreshSessionEntity>
> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    allowNull: false,
    primaryKey: true,
  })
  id: CreationOptional<string>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ForeignKey(() => UserEntity)
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  refreshToken: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  expiresAt: Date;

  @Column({
    type: DataType.UUID,
  })
  @CreatedAt
  createdAt: CreationOptional<Date>;

  @BelongsTo(() => UserEntity)
  user: NonAttribute<UserEntity>;
}
