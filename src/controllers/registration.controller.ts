import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import { ValidationError } from '../utils/error.utils';
import { validateTelegramInitData } from '../services/telegram.auth.service';
import { createUserService } from '../services/users.service';
import { generateAccessToken } from '../utils/jwt.utils';

export const registration = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const initData = req.headers['x-telegram-init-data'] as string;

      if (!initData) {
        throw new ValidationError('initData not found');
      }

      const validation = validateTelegramInitData(initData);

      if (!validation.isValid || !validation.user) {
        throw new ValidationError('Invalid telegram data');
      }

      const user = await createUserService({
        platform: 'telegram',
        platformId: validation.user.id,
        username: validation.user.username || '',
      });

      const token = generateAccessToken({ userId: user.id });

      res.json({
        accessToken: token,
      });
    } catch (e) {
      next(e);
    }
  },
);
