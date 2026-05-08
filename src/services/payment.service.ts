import {
  OrderRub,
  OrderZen,
  Practice,
  PracticeBundle,
  PracticeBundleItem,
} from '../db/models';
import { ValidationError, NotFoundError } from '../utils/error.utils';
import { createRobokassaToken, createSign } from '../utils/robokassa.utils';
import { spendCoinBalanceService } from './coin.service';
import { getPurchasedPracticeIds } from './practice.service';
import { getPurchasedBundleIds } from './practiceBundle.service';

const ROBOKASSA_CONFIG = {
  merchantLogin: process.env.ROBOKASSA_MERCHANT_LOGIN,
  password1: process.env.ROBOKASSA_PS1,
  password2: process.env.ROBOKASSA_PS2,
  password3: process.env.ROBOKASSA_PS3,
  apiUrl: {
    createInvoice:
      'https://services.robokassa.ru/InvoiceServiceWebApi/api/CreateInvoice',
    deactivateInvoice:
      'https://services.robokassa.ru/InvoiceServiceWebApi/api/DeactivateInvoice',
  },
};

export const createInvoiceRubService = async (params: {
  type: 'practice' | 'bundle';
  id: number;
  userId: number;
}) => {
  const { type, id, userId } = params;

  let invId = Date.now();
  let payload: any;

  const purchasedBundleIds = await getPurchasedBundleIds(userId);
  const purchasedPracticeIds = await getPurchasedPracticeIds(userId);

  if (type === 'practice') {
    if (purchasedPracticeIds.has(id)) {
      throw new ValidationError('practice already been purchased');
    }

    const practice = await Practice.findOne({
      where: { id },
    });

    if (!practice) {
      throw new NotFoundError('practice');
    }

    if (!practice.priceRub) {
      throw new ValidationError('practice has not price');
    }

    payload = {
      MerchantLogin: ROBOKASSA_CONFIG.merchantLogin,
      InvoiceType: 'OneTime',
      Culture: 'ru',
      InvId: invId,
      OutSum: practice.priceRub,
      MerchantComments: `Покупка практики "${practice.title}"`,
      UserFields: {
        purchase_type: 'practice',
        item_id: id.toString(),
      },
      InvoiceItems: [
        {
          Name: practice.title,
          Quantity: 1,
          Cost: practice.priceRub,
          Tax: 'vat20',
          PaymentMethod: 'full_payment',
          PaymentObject: 'service',
        },
      ],
    };

    await OrderRub.create({
      id: invId,
      userId,
      itemId: id,
      amount: practice.priceRub,
      status: 'pending',
      purchaseType: 'practice',
    });
  } else if (type === 'bundle') {
    if (purchasedBundleIds.has(id)) {
      throw new ValidationError('bundle already been purchased');
    }
    const bundle = await PracticeBundle.findOne({
      where: { id },
      include: [
        {
          model: PracticeBundleItem,
          as: 'practiceBundleItems',
          attributes: ['practiceId', 'position'],
          include: [
            {
              model: Practice,
              as: 'practice',
              attributes: ['id', 'title', 'priceZen', 'tags', 'description'],
            },
          ],
        },
      ],
    });

    if (!bundle) {
      throw new NotFoundError('bundle');
    }

    const allPractices =
      bundle?.practiceBundleItems?.map((item: any) => item.practice) || [];

    const totalPracticesCount = allPractices.length;

    const unpurchasedPractices = allPractices?.filter(
      (practice: any) => !purchasedPracticeIds.has(practice.id),
    );

    if (unpurchasedPractices?.length === 0) {
      throw new ValidationError(
        'All practices in this bundle have already been purchased',
      );
    }

    const pricePerPractice = bundle.priceRub / totalPracticesCount;

    const totalSum = Math.round(pricePerPractice * unpurchasedPractices.length);

    payload = {
      MerchantLogin: ROBOKASSA_CONFIG.merchantLogin,
      InvoiceType: 'OneTime',
      Culture: 'ru',
      InvId: invId,
      OutSum: totalSum,
      MerchantComments: `Покупка коллекции практик "${bundle.title}"`,
      UserFields: {
        purchase_type: 'bundle',
        item_id: id.toString(),
      },
      InvoiceItems: [
        {
          Name: `Коллекция практик "${bundle.title}"`,
          Quantity: 1,
          Cost: totalSum,
          Tax: 'vat20',
          PaymentMethod: 'full_payment',
          PaymentObject: 'service',
        },
      ],
    };

    await OrderRub.create({
      id: invId,
      userId,
      itemId: id,
      amount: bundle.priceRub,
      status: 'pending',
      purchaseType: 'bundle',
    });
  } else {
    throw new ValidationError(
      'Invalid purchase type. Use "practice" or "bundle"',
    );
  }

  const token = createRobokassaToken(
    payload,
    ROBOKASSA_CONFIG.password1 || '',
    ROBOKASSA_CONFIG.merchantLogin || '',
  );

  try {
    const response = await fetch(ROBOKASSA_CONFIG.apiUrl.createInvoice, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(token),
    });

    const data = (await response.json()) as {
      id?: string;
      invId?: number;
      url?: string;
      isSuccess: boolean;
      description?: string;
    };

    const isSuccess = data?.isSuccess;

    if (!isSuccess) {
      await OrderRub.destroy({ where: { id: invId } });
      throw new ValidationError(
        `Robokassa error: ${data.description || 'isSuccess:false'}`,
      );
    }

    return {
      url: data.url,
      invId: data.invId,
      purchaseType: type,
      purchaseId: id,
    };
  } catch (error) {
    await OrderRub.destroy({ where: { id: invId } }).catch(() => {});
    throw new ValidationError(`Robokassa API error, ${JSON.stringify(error)}`);
  }
};

export const createInvoiceZenService = async (params: {
  id: number;
  userId: number;
}) => {
  const type = 'practice';

  const { id, userId } = params;

  const practice = await Practice.findOne({
    where: { id },
  });

  if (!practice) {
    throw new NotFoundError('practice');
  }

  if (!practice.priceZen) {
    throw new ValidationError('practice has not priceZen');
  }

  await OrderZen.create({
    userId,
    itemId: id,
    amount: practice.priceZen,
    purchaseType: type,
  });

  await spendCoinBalanceService({
    userId,
    amount: practice.priceZen,
    practiceId: id,
  });

  return {};
};

export const checkInvoiceStatusService = async (props: {
  OutSum: number;
  InvId: number;
  SignatureValue: string;
}) => {
  const { OutSum, InvId, SignatureValue } = props;

  const signatureString = `${OutSum}:${InvId}:${ROBOKASSA_CONFIG.password2}`;
  const mySign = createSign(signatureString);

  if (mySign !== SignatureValue) {
    throw new ValidationError('SignatureValue error');
  }

  await OrderRub.update({ status: 'paid' }, { where: { InvId } });

  return {
    status: `OK${InvId}`,
  };
};

export const getPaymentStatusService = async (props: {
  invId: number;
  userId: number;
}) => {
  const { userId, invId } = props;

  const order = await OrderRub.findOne({ where: { id: invId, userId } });

  if (!order) {
    throw new NotFoundError('order');
  }

  return {
    status: order.status,
  };
};

export const deactivateInvoiceService = async (invId: number) => {
  const payload = {
    MerchantLogin: ROBOKASSA_CONFIG.merchantLogin,
    InvId: invId,
  };

  const token = createRobokassaToken(
    payload,
    ROBOKASSA_CONFIG.password1 || '',
    ROBOKASSA_CONFIG.merchantLogin || '',
  );

  try {
    const response = await fetch(ROBOKASSA_CONFIG.apiUrl.deactivateInvoice, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(token),
    });

    const data = await response.json();
    const isSuccess = data?.isSuccess;

    if (!isSuccess) {
      throw new NotFoundError(`isSuccess:false`);
    }

    return {
      isSuccess,
    };
  } catch (error) {
    throw new ValidationError(`Robokassa API error ${JSON.stringify(error)}`);
  }
};
