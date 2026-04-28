import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import { deleteUserService } from '../services/users.service';

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      await deleteUserService(userId);

      res.json();
    } catch (e) {
      next(e);
    }
  },
);
