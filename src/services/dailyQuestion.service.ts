import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { DailyQuestion, UserDailyQuestion } from '../db/models';
import { Op } from 'sequelize';
import { ValidationError } from '../utils/error.utils';

export const getTodayQuestion = async (userId: number) => {
  const count = await DailyQuestion.count();

  if (count === 0) {
    throw new ValidationError('Таблица с вопросами пуста');
  }

  const baseDate = startOfDay(new Date('2026-01-01'));
  const today = startOfDay(new Date());

  const dayIndex = differenceInCalendarDays(today, baseDate) % count;

  const question = await DailyQuestion.findOne({
    offset: dayIndex,
    limit: 1,
    order: [['id', 'ASC']],
    include: [
      {
        model: UserDailyQuestion,
        as: 'UserDailyQuestion',
        where: {
          userId: userId,
          createdAt: { [Op.gte]: today },
        },
        required: false,
      },
    ],
  });

  if (!question) {
     throw new ValidationError('Вопрос не найден');
  }
  
  const userAnswer = question.UserDailyQuestion?.[0]?.answer || null;
  const hasAnswered = !!question.UserDailyQuestion?.[0];

  return {
    questionId: question.id,
    question: question.question,
    userAnswer,
    hasAnswered,
  };
};

export const createTodayAnswer = async (userId: number, answer: string) => {
  const { questionId, hasAnswered } = await getTodayQuestion(userId);

  if (hasAnswered) {
    throw new ValidationError('Пользователь уже ответил на этот вопрос');
  }

  return UserDailyQuestion.create({
    userId: userId,
    questionId,
    answer,
  });
};
