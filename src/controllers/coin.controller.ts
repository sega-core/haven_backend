import { NextFunction, Request, Response } from 'express';
import {
  createDailyBonusService,
  getCoinBalanceService,
} from '../services/coin.service';
import { asyncHandler } from '../decorators/asyncHandler';

export const claimDailyCoin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await createDailyBonusService(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getCoinBalance = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await getCoinBalanceService(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);