import { Gratitude } from '../db/models';

import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';

export const create = async (userId: number, text: string) => {
  const record = await Gratitude.create({
    userId,
    text,
  });

  return record;
};

export const getForCurrentDay = async (userId: number) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const items = await Gratitude .findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [todayStart, todayEnd],
      },
    },
    order: [['createdAt', 'ASC']],
  });

  return items;
};