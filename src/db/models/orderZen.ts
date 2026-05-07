import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class OrderZen extends Model {
  declare id: number;
  declare userId: number;
  declare itemId: number;
  declare amount: number;
  declare purchaseType: string;
}

OrderZen.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    itemId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    purchaseType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'order_zen',
    timestamps: true,
    underscored: true,
  },
);