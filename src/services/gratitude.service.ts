import { Gratitude } from '../db/models';
import { Op } from 'sequelize';
import { startOfDay, endOfDay } from 'date-fns';

export const createGratitudeService = async (userId: number, comment: string) => {
  const record = await Gratitude.create({
    userId,
    comment,
  });

  return record;
};

export const getGratitudeService = async (userId: number) => {
  const todayStart = startOfDay(new Date());
  const todayEnd = endOfDay(new Date());

  const items = await Gratitude.findAll({
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

export const getGratitudeRangeService = async (
  userId: number,
  startDate?: string,
  endDate?: string
) => {
  const whereClause: any = { userId };
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    whereClause.createdAt = {
      [Op.between]: [start, end]
    };
  } else if (startDate) {
    const start = new Date(startDate);
    whereClause.createdAt = {
      [Op.gte]: start
    };
  } else if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    whereClause.createdAt = {
      [Op.lte]: end
    };
  }
  
  const items = await Gratitude.findAll({
    where: whereClause,
    order: [['createdAt', 'ASC']],
  });
  
  return items;
};