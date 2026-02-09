import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';

export class CoinTransaction extends Model {
  declare id: number;
  declare balanceId: number;
  declare amount: number;
  declare type: 'ACCRUE' | 'SPEND';
  declare meta: string;
}

CoinTransaction.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    balanceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'coin_transaction',
    timestamps: true,
    underscored: true,
  },
);


/* INSERT INTO coin_transaction (balance_id, amount, type) 
VALUES (1, 1000, 'ACCRUE'),; */