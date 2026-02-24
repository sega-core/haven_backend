import { NextFunction, Request, Response } from 'express';
import {
  createPracticeService,
  getPracticesInstructionsService,
  getPracticesService,
} from '../services/practice.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';

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
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await getPracticesService(userId);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const getPracticeInstructions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const practiceId = req.params.id;
    const userId = req.user.id;

    try {
      const result = await getPracticesInstructionsService(
        userId,
        Number(practiceId),
      );
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);
