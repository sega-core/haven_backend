import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { CoinTransaction } from './coinTransaction';

export class CoinBalance extends Model {
  declare id: number;
  declare userId: string;
  declare dailyStreak: number;
  declare lastBonusAt: string;
  declare coinTransactions?: CoinTransaction;
  declare balance: number;
}

CoinBalance.init(
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
    dailyStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastBonusAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'coin_balance',
    timestamps: true,
    underscored: true,
  },
);

/* INSERT INTO coin_balance (user_id, daily_streak, last_bonus_at) 
VALUES (2, 0, '2025-01-28');  */