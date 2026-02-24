import { NextFunction, Request, Response } from 'express';
import { getProgressService } from '../services/progress.service';
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
