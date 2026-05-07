import { Practice, Purchase } from '../db/models';
import { ValidationError } from '../utils/error.utils';

export const createPracticeService = async (body: {
  title: string;
  description: string;
  tags: string[];
  priceZen: number;
}) => {
  const record = await Practice.create(body);

  return record;
};

export const getPracticesService = async (userId: number) => {
  const items = await Practice.findAll({
    attributes: { exclude: ['instructions'] },
    include: [
      {
        model: Purchase,
        as: 'purchases',
        required: false,
        where: { userId },
        attributes: ['id'],
      },
    ],
    order: [['sequence', 'ASC']],
  });

  const withPurchaseFlag = (item: Practice) => {
    const { purchases, ...other } = item.toJSON();

    return {
      ...other,
      isPurchased: Boolean(purchases?.length),
    };
  };

  return items.map(withPurchaseFlag);
};

export const getPracticesInstructionsService = async (
  userId: number,
  practiceId: number,
) => {
  const item = await Practice.findOne({
    where: { id: practiceId },
    attributes: ['instructions'],
    include: [
      {
        model: Purchase,
        as: 'purchases',
        required: false,
        where: { userId, practiceId },
        attributes: ['id'],
      },
    ],
  });

  const checkPurchase = (item: Practice | null) => {
    if (!item) throw new ValidationError('Practice not found');
    const { purchases, ...other } = item.toJSON();

    if (Boolean(purchases?.length)) {
      return { ...other };
    }
    throw new ValidationError('The practice is not bought');
  };

  return checkPurchase(item);
};
