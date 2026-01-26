import { NextFunction, Request, Response } from 'express';
import { createAnswerService } from '../services/dailyQuestion.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

export const createAnswer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer } = req.body;

      if (!answer) {
        throw new ValidationError('Поле answer обязательно');
      }
      const result = await createAnswerService(TEMP_USER_ID, answer);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
