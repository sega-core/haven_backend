import { NextFunction, Request, Response } from 'express';
import {
  createPracticeService,
  getPracticesService,
} from '../services/practice.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

export const createPractice = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {
        title: string;
        subTitle: string;
        description: string;
        tags: string[];
        priceZen: number;
      }
    >,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { title, subTitle, description, priceZen } = req.body;

      if (!title || !subTitle || !description || !priceZen) {
        throw new ValidationError(
          'fields: title, subTitle, description, priceZen is required',
        );
      }

      const result = await createPracticeService(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getPractices = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await getPracticesService(TEMP_USER_ID);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
