import { sequelize } from '../index';

export  { Mood } from './mood';
export  { Gratitude } from './gratitude';


export const initDb = async () => {
  await sequelize.authenticate();
};
