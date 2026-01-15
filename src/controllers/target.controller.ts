import { NextFunction, Request, Response } from 'express';
import { create, update, markDone, get } from '../services/target.service';
import { asyncHandler } from '../decorators/asyncHandler';
import { TEMP_USER_ID } from '../app';

export const createTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await create(TEMP_USER_ID, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

export const updateTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const targetId = req.params.id;
    try {
      const target = await update(TEMP_USER_ID, Number(targetId), req.body);
      res.json(target);
    } catch (error) {
      next(error);
    }
  },
);

export const markDoneTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const targetId = req.params.id;
    try {
      await markDone(TEMP_USER_ID, Number(targetId));
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
);

export const getTarget = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const target = await get(TEMP_USER_ID);
      res.json(target);
    } catch (error) {
      next(error);
    }
  },
);
