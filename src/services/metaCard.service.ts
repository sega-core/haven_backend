import { differenceInCalendarDays, startOfDay } from 'date-fns';
import { MetaCard, UserMetaCardAnswer } from '../db/models';
import { NotFoundError, ValidationError } from '../utils/error.utils';
import { Op } from 'sequelize';

export const getMetaCardService = async (userId: number) => {
  const count = await MetaCard.count();

  if (count === 0) {
    throw new NotFoundError('MetaCard');
  }

  const baseDate = startOfDay(new Date('2026-01-01'));
  const today = startOfDay(new Date());

  const dayIndex = differenceInCalendarDays(today, baseDate) % count;

  const metaCard = await MetaCard.findOne({
    offset: dayIndex,
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
