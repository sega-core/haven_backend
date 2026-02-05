import { NextFunction, Request, Response } from 'express';
import {
  createPracticeBundleService,
  getPracticeBundlesService,
} from '../services/practiceBundle.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

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
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPracticeBundlesService(TEMP_USER_ID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
