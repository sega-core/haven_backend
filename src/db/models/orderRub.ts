import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class OrderRub extends Model {
  declare id: number;
  declare userId: string;
  declare itemId: number;
  declare amount: number;
  declare purchaseType: string;
  declare status: string;
}

OrderRub.init(
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
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'order_rub',
    timestamps: true,
    underscored: true,
  },
);