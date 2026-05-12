import { startOfDay } from 'date-fns';
import { MetaCard, UserMetaCardAnswer } from '../db/models';
import { NotFoundError, ValidationError } from '../utils/error.utils';
import { Op } from 'sequelize';

export const getMetaCardService = async (userId: number) => {
  const totalCards = await MetaCard.count();

  if (totalCards === 0) {
    throw new NotFoundError('MetaCard');
  }

  const today = startOfDay(new Date());

  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const hash = (userId + dayOfYear.toString())
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const index = hash % totalCards;

  const metaCard = await MetaCard.findOne({
    offset: index,
    limit: 1,
    order: [['id', 'ASC']],
    include: [
      {
        model: UserMetaCardAnswer,
        as: 'UserMetaCardAnswer',
        where: {
          userId: userId,
          createdAt: { [Op.gte]: today },
        },
        required: false,
      },
    ],
  });

  if (!metaCard) {
    throw new NotFoundError('MetaCard');
  }

  const { felt, seen, understood, createdAt } =
    metaCard.UserMetaCardAnswer?.[0] || {};

  return {
    id: metaCard.id,
    metaCard: {
      title: metaCard.title,
      description: metaCard.description,
      imgUrl: metaCard.imgUrl,
    },
    answer: {
      felt,
      seen,
      understood,
    },
    hasAnsweredToday: !!metaCard.UserMetaCardAnswer?.[0],
    createdAt,
  };
};

export const createMetaCardAnswerService = async (body: {
  userId: number;
  felt: string;
  seen: string;
  understood: string;
}) => {
  const { userId, seen, felt, understood } = body;

  const { id, hasAnsweredToday } = await getMetaCardService(userId);

  if (hasAnsweredToday) {
    throw new ValidationError('User is answered this card');
  }

  return UserMetaCardAnswer.create({
    userId,
    metaCardId: id,
    seen,
    felt,
    understood,
  });
};

export const getMetaCardAnswerRangeService = async (
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

  const userAnswers = await UserMetaCardAnswer.findAll({
    where: whereClause,
    include: [
      {
        model: MetaCard,
        as: 'MetaCard',
      },
    ],
    order: [['createdAt', 'ASC']],
  });

  const items = userAnswers.map((answer) => ({
    id: answer.id,
    metaCard: {
      title: answer?.MetaCard?.title,
      imgUrl: answer?.MetaCard?.imgUrl,
    },
    answer: {
      felt: answer.felt,
      seen: answer.seen,
      understood: answer.understood,
    },
    createdAt: answer.createdAt,
    hasAnsweredToday: true,
  }));

  return items;
};
