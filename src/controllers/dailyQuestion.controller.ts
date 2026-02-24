import { NextFunction, Request, Response } from 'express';
import { createAnswerService } from '../services/dailyQuestion.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';

export const createAnswer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer } = req.body;
      const userId = req.user.id;

      if (!answer) {
        throw new ValidationError('Поле answer обязательно');
      }
      const result = await createAnswerService(userId, answer);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
