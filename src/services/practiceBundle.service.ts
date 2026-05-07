import {
  PracticeBundle,
  PracticeBundleItem,
  Practice,
  OrderRub,
} from '../db/models';
import { getPurchasedPracticeIds } from './practice.service';

export const createPracticeBundleService = async (body: {
  title: string;
  description: string;
  priceRub: number;
  tags?: string[];
  practiceIds: number[];
}) => {
  const { practiceIds, ...bundleData } = body;

  const bundle = await PracticeBundle.create(bundleData);

  const items = practiceIds.map((practiceId, index) => ({
    bundleId: bundle.id,
    practiceId,
    position: index + 1,
  }));

  await PracticeBundleItem.bulkCreate(items);

  return bundle;
};

export const getPracticeBundlesService = async (userId: number) => {
  const bundles = await PracticeBundle.findAll({
    where: { isActive: true },
    include: [
      {
        model: PracticeBundleItem,
        as: 'practiceBundleItems',
        attributes: ['practiceId', 'position'],
        include: [
          {
            model: Practice,
            as: 'practice',
            attributes: { exclude: ['instructions'] },
          },
        ],
      },
    ],
    order: [['sequence', 'ASC']],
  });

  const purchasedBundleIds = await getPurchasedBundleIds(userId);
  const purchasedPracticeIds = await getPurchasedPracticeIds(userId);

  return bundles.map((bundle) => {
    const json = bundle.toJSON();

    const isBundlePurchased = purchasedBundleIds.has(bundle.id);

    const allPractices =
      bundle?.practiceBundleItems?.map((item: any) => item.practice) || [];

    const totalPracticesCount = allPractices.length;

    const unpurchasedPractices = allPractices?.filter(
      (practice: any) => !purchasedPracticeIds.has(practice.id),
    );

    const allPracticesPurchased = unpurchasedPractices?.length === 0

    const pricePerPractice = bundle.priceRub / totalPracticesCount;

    const priceRubWithDiscount = Math.round(
      pricePerPractice * unpurchasedPractices.length,
    );

    return {
      isPurchased: isBundlePurchased || allPracticesPurchased,
      priceRubWithDiscount,
      ...json,
      practiceBundleItems: json.practiceBundleItems.map((item: any) => ({
        ...item,
        practice: {
          ...item.practice,
          isPurchased:
            isBundlePurchased || purchasedPracticeIds.has(item.practice.id),
        },
      })),
    };
  });
};

export const getPurchasedBundleIds = async (
  userId: number,
): Promise<Set<number>> => {
  const purchasedPracticeIds = new Set<number>();

  const rubPurchases = await OrderRub.findAll({
    where: {
      userId,
      purchaseType: 'bundle',
      status: 'paid',
    },
    attributes: ['itemId'],
    raw: true,
  });
  rubPurchases.forEach((p) => purchasedPracticeIds.add(p.itemId));

  return purchasedPracticeIds;
};
