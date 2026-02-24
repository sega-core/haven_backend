import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.utils';
import { User } from '../db/models';
import { UnauthorizedError } from '../utils/error.utils';

export const jwtAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token');
    }

    const token = authHeader.split(' ')[1];

    const payload = verifyAccessToken(token);

    const user = await User.findByPk(payload.userId);

    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    req.user = user;

    next();
  } catch (e) {
    next(new UnauthorizedError('Invalid token'));
  }
};
