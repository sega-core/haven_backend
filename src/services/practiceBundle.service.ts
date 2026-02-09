import {
  PracticeBundle,
  PracticeBundleItem,
  Practice,
  PurchaseBundle,
  Purchase,
} from '../db/models';

const BUNDLE_DISCOUNT_PERCENT = 20;

const applyDiscount = (price: number) =>
  Math.floor(price * (1 - BUNDLE_DISCOUNT_PERCENT / 100));

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
            attributes: ['id', 'title', 'subTitle', 'priceZen', 'tags', 'description'],
          },
        ],
      },
    ],
    order: [
      [
        { model: PracticeBundleItem, as: 'practiceBundleItems' },
        'position',
        'ASC',
      ],
    ],
  });

  const purchasedBundleIds = new Set(
    (
      await PurchaseBundle.findAll({
        where: { userId },
        attributes: ['bundleId'],
      })
    ).map((b) => b.bundleId),
  );

  const purchasedPracticeIds = new Set(
    (
      await Purchase.findAll({
        where: { userId },
        attributes: ['practiceId'],
      })
    ).map((p) => p.practiceId),
  );

  return bundles.map((bundle) => {
    const json = bundle.toJSON();

    const isBundlePurchased = purchasedBundleIds.has(bundle.id);

    const somePurchesedByZen = json?.practiceBundleItems
      .map((item: any) => purchasedPracticeIds.has(item.practice.id))
      .some((item: boolean) => item);

    return {
      priceRubWithDiscount: applyDiscount(json.priceRub),
      isApplyDiscount: somePurchesedByZen,
      isPurchasedBundle: isBundlePurchased,
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
