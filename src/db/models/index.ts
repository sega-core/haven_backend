import { sequelize } from '../index';

export  { User } from './user';
export  { Mood } from './mood';
export  { Gratitude } from './gratitude';
export  { DailyQuestion } from './dailyQuestion';
export  { UserDailyQuestion } from './userDailyQuestion';

export const initDb = async () => {
  await sequelize.authenticate();
};
