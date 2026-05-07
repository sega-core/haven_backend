import { OrderRub, OrderZen, Practice, PracticeBundleItem } from '../db/models';
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
  const practices = await Practice.findAll({
    attributes: { exclude: ['instructions'] },
    order: [['sequence', 'ASC']],
    raw: true,
  });

  const purchasedPracticeIds = await getPurchasedPracticeIds(userId);

  return practices.map((practice) => ({
    ...practice,
    isPurchased: purchasedPracticeIds.has(practice.id),
  }));
};

export const getPracticesInstructionsService = async (
  userId: number,
  practiceId: number,
) => {
  const isPurchased = await isPracticePurchased(userId, practiceId);

  if (!isPurchased) {
    throw new ValidationError('The practice is not bought');
  }

  const practice = await Practice.findOne({
    where: { id: practiceId },
    attributes: ['instructions'],
  });

  if (!practice) {
    throw new ValidationError('Practice not found');
  }

  return practice;
};

export const getPurchasedPracticeIds = async (
  userId: number,
): Promise<Set<number>> => {
  const purchasedPracticeIds = new Set<number>();

  const rubPurchases = await OrderRub.findAll({
    where: {
      userId,
      purchaseType: 'practice',
      status: 'paid',
    },
    attributes: ['itemId'],
    raw: true,
  });
  rubPurchases.forEach((p) => purchasedPracticeIds.add(p.itemId));

  const zenPurchases = await OrderZen.findAll({
    where: {
      userId,
      purchaseType: 'practice',
    },
    attributes: ['itemId'],
    raw: true,
  });
  zenPurchases.forEach((p) => purchasedPracticeIds.add(p.itemId));

  return purchasedPracticeIds;
};

export const isPracticePurchased = async (
  userId: number,
  practiceId: number,
): Promise<boolean> => {
  const purchasedIds = await getPurchasedPracticeIds(userId);
  return purchasedIds.has(practiceId);
};
