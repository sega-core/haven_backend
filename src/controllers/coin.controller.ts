import { NextFunction, Request, Response } from 'express';
import {
  createDailyBonusService,
  getCoinBalanceService,
  spendCoinBalanceService,
} from '../services/coin.service';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

export const claimDailyCoin = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await createDailyBonusService(TEMP_USER_ID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getCoinBalance = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getCoinBalanceService(TEMP_USER_ID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const spendCoinBalance = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { amount, practiceId } = req.body;

    try {
      const result = await spendCoinBalanceService(TEMP_USER_ID, amount, practiceId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
