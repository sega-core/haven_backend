import { NextFunction, Request, Response } from 'express';
import {
  getTodayQuestion,
  createTodayAnswer,
} from '../services/dailyQuestion.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

export const handleGetTodayQuestion = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getTodayQuestion(TEMP_USER_ID);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
export const handleCreateAnswer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { answer } = req.body;

      if (!answer) {
        throw new ValidationError('Поле answer обязательно');
      }
      const result = await createTodayAnswer(TEMP_USER_ID, answer);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);