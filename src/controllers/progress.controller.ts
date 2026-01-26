import { NextFunction, Request, Response } from 'express';
import { getProgressService } from '../services/progress.service';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

export const getProgress = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getProgressService(TEMP_USER_ID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

