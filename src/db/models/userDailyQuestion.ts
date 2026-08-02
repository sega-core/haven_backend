import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../index';
import { DailyQuestion } from './dailyQuestion';

export class UserDailyQuestion extends Model {
  declare id: number;
  declare userId: string;
  declare questionId: number;
  declare answer: string;
  declare createdAt: string;
  declare DailyQuestion: DailyQuestion;
}

UserDailyQuestion.init(
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
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    answer: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_daily_question',
    timestamps: true,
    underscored: true,
  },
);
