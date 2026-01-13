import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class User extends Model {
  declare id: number;
  declare userId: number;
  declare service: string;
  declare username: number;
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    platformId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  },
);

export default User;
