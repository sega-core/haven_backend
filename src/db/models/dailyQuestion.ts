import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { UserDailyQuestion } from './userDailyQuestion';

export class DailyQuestion extends Model {
  declare id: number;
  declare question: string;
  declare UserDailyQuestion?: UserDailyQuestion[];
}

DailyQuestion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING(1000),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    tableName: 'daily_question',
    timestamps: true,
    underscored: true,
  },
);