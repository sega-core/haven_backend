import { Mood } from '../db/models';
import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';

export const createMoodService = async (
  userId: number,
  level: number,
  tags: string[],
  comment: string,
) => {
  const record = await Mood.create({
    userId,
    level,
    tags,
    comment,
  });

  return record;
};

export const getMoodService= async (userId: number) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const items = await Mood.findOne({
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
