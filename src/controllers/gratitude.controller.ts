import { NextFunction, Request, Response } from 'express';
import { create, getForCurrentDay } from '../services/gratitude.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

/* const userId = req?.user?.userId;  */ // из auth middleware TODO

export const createGratitude = asyncHandler(
  async (
    req: Request<{}, {}, { text: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { text } = req.body;

      if (!text) {
        throw new ValidationError('Поле text обязательно');
      }
      if (text.length > 1000) {
        throw new ValidationError('Текст не должен быть больше 1000 символов');
      }

      const result = await create(TEMP_USER_ID, text);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getGratitude = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getForCurrentDay(TEMP_USER_ID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
