import { NextFunction, Request, Response } from 'express';
import {
  createTargetService,
  markDoneTargetService,
  getTargetService,
  deleteTargetService,
} from '../services/target.service';
import { asyncHandler } from '../decorators/asyncHandler';

export const createTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const result = await createTargetService(userId, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

/* export const updateTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const targetId = req.params.id;
    try {
      const target = await update(TEMP_USER_ID, Number(targetId), req.body);
      res.json(target);
    } catch (error) {
      next(error);
    }
  },
); */

export const markDoneTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const targetId = req.params.id;
    try {
      await markDoneTargetService(Number(targetId));
      res.json({ success: true });
    } catch (error) {
      next(error);
    }
  },
);

export const getTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const target = await getTargetService(userId);
      res.json(target);
    } catch (error) {
      next(error);
    }
  },
);

export const deleteTarget = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const targetId = req.params.id;
      const userId = req.user.id;
      const target = await deleteTargetService(userId, Number(targetId));
      res.json(target);
    } catch (error) {
      next(error);
    }
  },
);
