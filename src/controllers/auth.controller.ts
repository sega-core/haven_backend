import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import { UnauthorizedError } from '../utils/error.utils';
import { validateTelegramInitData } from '../services/telegram.auth.service';
import { createUserService, getUserService } from '../services/users.service';
import { generateAccessToken } from '../utils/jwt.utils';

export const checkAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('checkAuth')
      const initData = req.headers['x-telegram-init-data'] as string;

      if (!initData) {
        throw new UnauthorizedError('initData not found');
      }

      const validation = validateTelegramInitData(initData);

      if (!validation.isValid || !validation.user) {
        throw new UnauthorizedError('Invalid telegram data');
      }

      let user = await getUserService({
        platform: 'telegram',
        platformId: validation.user.id,
        username: validation.user.username || '',
      });

      if (!user) {
        user = await createUserService({
          platform: 'telegram',
          platformId: validation.user.id,
          username: validation.user.username || '',
        });
      }

      const token = generateAccessToken({ userId: user.id });

      console.log({token})

      res.json({
        accessToken: token,
        user,
      });
    } catch (e) {
      next(e);
    }
  },
);
