import { Purchase } from '../db/models';

export const createPurchaseService = async (
  userId: number,
  practiceId: number,
) => {
  await Purchase.create({ userId, practiceId });
};
