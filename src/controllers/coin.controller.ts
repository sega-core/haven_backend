import { NextFunction, Request, Response } from 'express';
import { claimDailyBonusService, getCoinBalanceService } from '../services/coin.service';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

/* INSERT INTO coin_balance (user_id, daily_streak, last_bonus_at, total) 
VALUES (1, 0, '2025-01-28',0); */

export const claimDailyCoin = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await claimDailyBonusService(TEMP_USER_ID);
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
