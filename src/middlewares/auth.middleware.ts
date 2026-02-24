import { Request, Response, NextFunction } from 'express';
import { validateTelegramInitData } from '../services/telegram.auth.service';
import { createUserService, getUserService } from '../services/users.service';
import { UnauthorizedError } from '../utils/error.utils';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const initData = req.headers['x-telegram-init-data'] as string;

    if (!initData) {
      throw new UnauthorizedError('initData not found');
    }

    const validation = validateTelegramInitData(initData);

    if (!validation.isValid || !validation.user) {
      throw new UnauthorizedError();
    }

    const user = await getUserService({
      platform: 'telegram',
      platformId: validation.user.id,
      username: validation.user.username || '',
    });

    if (!user) {
      const newUser = await createUserService({
        platform: 'telegram',
        platformId: validation.user.id,
        username: validation.user.username || '',
      });

      req.user = newUser;
      return next();
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
