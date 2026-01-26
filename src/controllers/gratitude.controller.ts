import { NextFunction, Request, Response } from 'express';
import { createGratitudeService } from '../services/gratitude.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

/* const userId = req?.user?.userId;  */ // из auth middleware TODO

export const createGratitude = asyncHandler(
  async (
    req: Request<{}, {}, { comment: string }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { comment } = req.body;

      if (!comment) {
        throw new ValidationError('Поле comment обязательно');
      }
      if (comment.length > 1000) {
        throw new ValidationError('Текст не должен быть больше 1000 символов');
      }

      const result = await createGratitudeService(TEMP_USER_ID, comment);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
