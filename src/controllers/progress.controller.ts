import { NextFunction, Request, Response } from 'express';
import { getProgressService, getProgressRangeService } from '../services/progress.service';
import { asyncHandler } from '../decorators/asyncHandler';

export const getProgress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await getProgressService(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getProgressRange = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const { startDate, endDate } = req.query;
      const result = await getProgressRangeService(userId, startDate as string, endDate as string);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);