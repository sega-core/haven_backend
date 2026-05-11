import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import {
  deleteUserService,
  updateUserService,
} from '../services/users.service';

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

export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;

      const allowedFields = ['onboardingCompleted'];

      const filteredData = Object.keys(updateData)
        .filter((key) => allowedFields.includes(key))
        .reduce(
          (obj, key) => {
            obj[key] = updateData[key];
            return obj;
          },
          {} as Record<string, any>,
        );

      if (Object.keys(filteredData).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Нет разрешенных полей для обновления',
        });
      }

      const updatedUser = await updateUserService(userId, filteredData);

      res.json({
        success: true,
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  },
);
