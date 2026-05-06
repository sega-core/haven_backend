import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import { createInvoiceService, deactivateInvoiceService } from '../services/payment.service';

export const createPayment = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const practiceId = req.params.practiceId;
      const userId = req.user.id;


      const result = await createInvoiceService(Number(practiceId), userId);
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
