import { Target, TargetCompletion } from '../db/models';

import { ValidationError } from '../utils/error.utils';
import { startOfDay, getDay, differenceInDays, format } from 'date-fns';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const create = async (
  userId: number,
  data: {
    startDate: string;
    endDate: string;
    weekDays: string[];
    notifyTime?: string;
  },
) => {
  const record = await Target.create({
    userId,
    ...data,
  });

  return record;
};

export const update = async (
  userId: number,
  id: number,
  data: {
    startDate: string;
    endDate: string;
    weekDays: string[];
    notifyTime?: string;
  },
) => {
  const target = await Target.findOne({
    where: { id, userId },
  });
  if (!target) throw new ValidationError('Цель не найдена');

  return target.update(data);
};

export const markDone = async (
  userId: number,
  targetId: number,
  date = startOfDay(new Date()),
) => {
  const target = await TargetCompletion.findOne({ where: { targetId, date } });

  if (target?.completed) {
    throw new ValidationError('Цель на сегодня уже завершена');
  }

  return TargetCompletion.upsert({
    userId,
    targetId,
    date,
    completed: true,
  });
};

export const get = async (userId: number) => {
  const targets = await Target.findAll({
    where: { userId },
    order: [['created_at', 'DESC']],
    include: [
      {
        model: TargetCompletion,
        as: 'TargetCompletion',
        /* attributes: ['date', 'completed'], */
        required: false,
      },
    ],
  });

  console.log('result', '\n\n', JSON.stringify(targets), '\n\n');

  const targetsWithProgress = await Promise.all(
    targets.map(async (target) => {
      return await calculateTargetProgress(target);
    }),
  );

  return targetsWithProgress;
};

export const getForWeekday = async (userId: number) => {
  const targets = await Target.findAll({
    where: { userId },
    order: [['created_at', 'DESC']],
    include: [
      {
        model: TargetCompletion,
        as: 'TargetCompletion',
        attributes: ['date', 'completed'],
        required: false,
      },
    ],
  });

  const targetsWithProgress = await Promise.all(
    targets.map(async (target) => {
      return await calculateTargetProgress(target);
    }),
  );

  return targetsWithProgress;
};

export const calculateTargetProgress = async (target: Target) => {
  const startDate = new Date(target.startDate);
  const endDate = new Date(target.endDate);

  const totalDays = Math.max(differenceInDays(endDate, startDate) + 1, 0);

  const completionDates =
    target.TargetCompletion?.map((item) => format(item.date, 'yyyy-MM-dd')) ||
    [];

  const completedDays = completionDates.length;
  const completionRate =
    totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0;

  return {
    id: target.id,
    title: target.title,
    startDate: target.startDate,
    endDate: target.endDate,
    weekdays: target.weekdays,
    notifyTime: target.notifyTime,
    totalDays,
    completedDays,
    completionRate,
  };
};
