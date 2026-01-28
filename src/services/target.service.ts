import { Target, TargetCompletion } from '../db/models';
import { ValidationError } from '../utils/error.utils';
import { startOfDay, getDay, format, eachDayOfInterval } from 'date-fns';

const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export const createTargetService = async (
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

export const updateTargetService = async (
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

export const deleteTargetService = async (userId: number, id: number) => {
  const target = await Target.findOne({
    where: { id, userId },
  });

  if (!target) throw new ValidationError('Цель не найдена');

  return target.destroy();
};

export const markDoneTargetService = async (
  targetId: number,
  date = startOfDay(new Date()),
) => {
  const target = await TargetCompletion.findOne({ where: { targetId, date } });

  //TODO: сделать недоступность отметки в неположенную дату, пока ограничения только на ui

  if (target?.completed) {
    throw new ValidationError('Цель на сегодня уже завершена');
  }

  return TargetCompletion.upsert({
    targetId,
    date,
    completed: true,
  });
};

export const getTargetService = async (userId: number) => {
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
      return await calcTargetProgressService(target);
    }),
  );

  return targetsWithProgress;
};

export const calcTargetProgressService = async (target: Target) => {
  const startDate = new Date(target.startDate);
  const endDate = new Date(target.endDate);
  const today = format(new Date(), 'yyyy-MM-dd');

  const completionDates =
    target.TargetCompletion?.map((item) => format(item.date, 'yyyy-MM-dd')) ||
    [];

  const completedDays = completionDates.length;

  const numericWeekdays = target.weekdays
    .map((day) => WEEKDAY_KEYS.indexOf(day.toLowerCase()))
    .filter((index) => index !== -1);

  const allDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  }).map((day) => format(day, 'yyyy-MM-dd'));

  const relevantDays = allDays.filter((day) => {
    const dayOfWeek = getDay(day);

    return numericWeekdays.includes(dayOfWeek);
  });

  const completionRate =
    relevantDays.length > 0
      ? Math.round((completedDays / relevantDays.length) * 100)
      : 0;

  const isCompletedToday = !!completionDates.find((item) => item === today);

  const isCanCompletedToday = !!relevantDays.find((item) => item === today);

  return {
    id: target.id,
    title: target.title,
    startDate: target.startDate,
    endDate: target.endDate,
    weekdays: target.weekdays,
    notifyTime: target.notifyTime || '',
    completedDays,
    completionRate,
    relevantDays,
    isCompletedToday,
    isCanCompletedToday,
  };
};
