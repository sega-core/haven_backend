import { Practice, Purchase } from '../db/models';

export const createPracticeService = async (body: {
  title: string;
  subTitle: string;
  description: string;
  tags: string[];
  priceZen: number;
}) => {
  const record = await Practice.create(body);

  return record;
};

export const getPracticesService = async (userId: number) => {
  const items = await Practice.findAll({
    include: [
      {
        model: Purchase,
        as: 'purchases',
        required: false,
        where: { userId },
        attributes: ['id'],
      },
    ],
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
