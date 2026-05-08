import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import {
  createInvoiceRubService,
  deactivateInvoiceService,
  createInvoiceZenService,
  checkInvoiceStatusService,
  getPaymentStatusService,
} from '../services/payment.service';
import { ValidationError } from '../utils/error.utils';

export const createPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, id, currency } = req.body;
      const userId = req.user.id;

      if (currency === 'zen') {
        const result = await createInvoiceZenService({
          id: Number(id),
          userId,
        });
        return res.json(result);
      }

      if (currency === 'rub') {
        const result = await createInvoiceRubService({
          type: type as 'practice' | 'bundle',
          id: Number(id),
          userId,
        });

        return res.json(result);
      }

      throw new ValidationError('currency');
    } catch (error) {
      next(error);
    }
  },
);

export const checkPaymentStatus = asyncHandler(
  //payment-result calback robokassa
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { OutSum, InvId, SignatureValue } = req.params;

      const result = await checkInvoiceStatusService({
        OutSum: Number(OutSum),
        InvId: Number(InvId),
        SignatureValue,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getPaymentStatus = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const userId = req.user.id;

      const result = await getPaymentStatusService({
        userId,
        invId: Number(id),
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const deactivateInvoice = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const invId = req.params.invId;

      const result = await deactivateInvoiceService(Number(invId));
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
