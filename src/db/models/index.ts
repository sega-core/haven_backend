import { sequelize } from '../index';

export  { User } from './user';
export  { Mood } from './mood';
export  { Gratitude } from './gratitude';
export  { DailyQuestion } from './dailyQuestion';
export  { UserDailyQuestion } from './userDailyQuestion';
export  { Target } from './target';
export  { TargetCompletion } from './targetCompletion';

export const initDb = async () => {
  await sequelize.authenticate();
};
