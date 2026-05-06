import { Order, Practice } from '../db/models';
import { ValidationError, NotFoundError } from '../utils/error.utils';
import { createRobokassaToken } from '../utils/robokassa.utils';

const ROBOKASSA_CONFIG = {
  merchantLogin: process.env.ROBOKASSA_MERCHANT_LOGIN,
  password1: process.env.ROBOKASSA_PS1,
  apiUrl: {
    createInvoice:
      'https://merchant.roboxchange.com/InvoiceServiceWebApi/api/CreateInvoice',
    deactivateInvoice:
      'https://services.robokassa.ru/InvoiceServiceWebApi/api/DeactivateInvoice',
  },
};


export const createInvoiceService = async (
  practiceId: number,
  userId: number,
) => {
  const practice = await Practice.findOne({
    where: {
      id: practiceId,
    },
  });

  if (!practice) {
    throw new NotFoundError('practice');
  }

  const invId = Date.now();

  const payload = {
    MerchantLogin: ROBOKASSA_CONFIG.merchantLogin,
    InvoiceType: 'OneTime',
    Culture: 'ru',
    InvId: invId,
    OutSum: practice.priceRub,
    MerchantComments: `Покупка практики "${practice.title}"`,
    UserFields: {
      practice_id: practiceId.toString(),
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

  const token = createRobokassaToken(
    payload,
    ROBOKASSA_CONFIG.password1 || '',
    ROBOKASSA_CONFIG.merchantLogin || '',
  );

  console.log(JSON.stringify(token));

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
    };

    const isSuccess = data?.isSuccess;

    await Order.create({
      id: invId,
      userId,
      practiceId,
      amount: practice.priceRub,
      status: 'pending',
    });

    if (!isSuccess) {
      throw new ValidationError(`isSuccess:false`);
    }

    return { ...data };
  } catch (error) {
    throw new ValidationError(`Robokassa API error`);
  }
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
    throw new ValidationError(`Robokassa API error`);
  }
};
