import { NextFunction, Request, Response } from 'express';
import {
  createPracticeBundleService,
  getPracticeBundlesService,
} from '../services/practiceBundle.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';

export const createPracticeBundle = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {
        title: string;
        description: string;
        priceRub: number;
        tags: string[];
        practiceIds: number[];
      }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { title, description, tags, priceRub, practiceIds } = req.body;

      if (!title || !description || !priceRub || !practiceIds) {
        throw new ValidationError(
          'fields: title, description, priceRub is required',
        );
      }

      const result = await createPracticeBundleService({
        title,
        description,
        priceRub,
        tags,
        practiceIds,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getPracticeBundles = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await getPracticeBundlesService(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
