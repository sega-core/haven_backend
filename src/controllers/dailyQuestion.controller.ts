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

      if (answer.length > 1000) {
        throw new ValidationError('Текст не должен быть больше 1000 символов');
      }

      const result = await createAnswerService(userId, answer);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
