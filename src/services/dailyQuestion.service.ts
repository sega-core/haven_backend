import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { DailyQuestion, UserDailyQuestion } from '../db/models';
import { Op } from 'sequelize';
import { ValidationError } from '../utils/error.utils';

export const getDaylyQuestionService = async (userId: number) => {
  const count = await DailyQuestion.count();

  if (count === 0) {
    throw new ValidationError('DailyQuestion count is empty');
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
    throw new ValidationError('Question not found');
  }

  const userAnswer = question.UserDailyQuestion?.[0]?.answer || '';
  const createdAt = question.UserDailyQuestion?.[0]?.createdAt || '';

  const hasAnswered = !!question.UserDailyQuestion?.[0];

  return {
    questionId: question.id,
    question: question.question,
    userAnswer,
    hasAnswered,
    createdAt,
  };
};

export const createAnswerService = async (userId: number, answer: string) => {
  const { questionId, hasAnswered } = await getDaylyQuestionService(userId);

  if (hasAnswered) {
    throw new ValidationError('User is answered this question');
  }

  return UserDailyQuestion.create({
    userId: userId,
    questionId,
    answer,
  });
};

export const getDaylyQuestionRangeService = async (
  userId: number,
  startDate?: string,
  endDate?: string,
) => {
  const whereClause: any = { userId };

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    whereClause.createdAt = {
      [Op.between]: [start, end],
    };
  } else if (startDate) {
    const start = new Date(startDate);
    whereClause.createdAt = {
      [Op.gte]: start,
    };
  } else if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    whereClause.createdAt = {
      [Op.lte]: end,
    };
  }

  // Получаем ответы пользователя с вопросами
  const userAnswers = await UserDailyQuestion.findAll({
    where: whereClause,
    include: [
      {
        model: DailyQuestion,
        as: 'DailyQuestion',
        attributes: ['id', 'question'],
      },
    ],
    order: [['createdAt', 'ASC']],
  });

  const items = userAnswers.map((answer) => ({
    id: answer.id,
    questionId: answer.questionId,
    question: answer.DailyQuestion?.question || 'Вопрос не найден',
    userAnswer: answer.answer,
    createdAt: answer.createdAt,
  }));

  return items;
};
