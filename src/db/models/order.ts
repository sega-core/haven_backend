import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class Order extends Model {
  declare id: number;
  declare userId: number;
  declare practiceId?: number;
  declare bundleId?: number;
  declare amound: number;
  declare status: string;
}

Order.init(
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
    practiceId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    bundleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    amound: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'order',
    timestamps: true,
    underscored: true,
  },
);