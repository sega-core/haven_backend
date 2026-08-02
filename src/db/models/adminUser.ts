import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class AdminUser extends Model {
  declare id: string;
  declare userId: string;
  declare isActive: boolean;
}

AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'admin_users',
    timestamps: true,
    underscored: true,
  }
);
