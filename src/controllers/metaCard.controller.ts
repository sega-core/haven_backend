import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import {
  createMetaCardAnswerService,
  getMetaCardService,
} from '../services/metaCard.service';

export const createMetaCardAnswer = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { felt, seen, understood } = req.body;
      const userId = req.user.id;

      if (!felt || !seen || !understood) {
        throw new ValidationError('Заполните обязательные поля');
      }

      if (felt.length > 100 || seen.length > 100 || understood.length > 100) {
        throw new ValidationError('Текст не должен быть больше 100 символов');
      }

      const result = await createMetaCardAnswerService({
        userId,
        felt,
        seen,
        understood,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getMetaCard = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;

      const result = await getMetaCardService(userId);

      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
