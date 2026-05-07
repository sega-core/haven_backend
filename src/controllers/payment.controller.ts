import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import {
  createInvoiceRubService,
  deactivateInvoiceService,
  createInvoiceZenService,
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
