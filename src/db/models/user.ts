import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { nanoid } from 'nanoid';

export class User extends Model {
  declare id: number;
  declare platformId: number;
  declare platform: string;
  declare username: number;
  declare onboardingCompleted: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => nanoid(12),
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
    onboardingCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    underscored: true,
  },
);