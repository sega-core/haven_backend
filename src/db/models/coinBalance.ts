import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { CoinTransaction } from './coinTransaction';

export class CoinBalance extends Model {
  declare id: number;
  declare userId: number;
  declare dailyStreak: number;
  declare lastBonusAt: string;
  declare total: number;
}

CoinBalance.init(
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
    dailyStreak: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lastBonusAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    total: {
      type: DataTypes.INTEGER,
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

CoinBalance.hasMany(CoinTransaction, { foreignKey: 'id' });
CoinTransaction.belongsTo(CoinBalance, { foreignKey: 'balanceId' });
