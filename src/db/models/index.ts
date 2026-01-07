import { sequelize } from '../index';
import { Blagodarnost } from './blagodarnost';

export const models = {
  Blagodarnost,
};

export const initDb = async () => {
  await sequelize.authenticate();
};
