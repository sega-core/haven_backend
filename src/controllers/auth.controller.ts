import { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../decorators/asyncHandler';
import { NotFoundError, UnauthorizedError } from '../utils/error.utils';
import { validateTelegramInitData } from '../services/telegram.auth.service';
import { getUserService } from '../services/users.service';
import { generateAccessToken } from '../utils/jwt.utils';

export const checkAuth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const initData = req.headers['x-telegram-init-data'] as string;

      if (!initData) {
        res.redirect('https://t.me/havensupport_bot');
        return;
/*         throw new UnauthorizedError('initData not found');
 */      }

      const validation = validateTelegramInitData(initData);

      if (!validation.isValid || !validation.user) {
        throw new UnauthorizedError('Invalid telegram data');
      }

      const user = await getUserService({
        platformId: validation.user.id,
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      const token = generateAccessToken({ userId: user.id });

      res.json({
        accessToken: token,
        onboardingCompleted: user.onboardingCompleted,
      });
    } catch (e) {
      next(e);
    }
  },
);
