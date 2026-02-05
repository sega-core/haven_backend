import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class CashTransaction extends Model {
  declare id: number;
  declare balanceId: number;
  declare amount: number;
  declare type: 'SPEND';
  declare meta: string;
}

CashTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    meta: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'cash_transaction',
    timestamps: true,
    underscored: true,
  },
);
