import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Role } from 'src/core/role';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class UserEntity extends Model<
  InferAttributes<UserEntity>,
  InferCreationAttributes<UserEntity>
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
    allowNull: true,
  })
  email: CreationOptional<string | null>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: CreationOptional<string | null>;

  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(Role))),
    allowNull: true,
    defaultValue: [Role.CLIENT],
  })
  roles: CreationOptional<Role[]>;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  passwordHash: string;

  @Column({
    type: DataType.UUID,
  })
  @CreatedAt
  createdAt: CreationOptional<Date>;

  @UpdatedAt
  updatedAt: CreationOptional<Date>;
}
