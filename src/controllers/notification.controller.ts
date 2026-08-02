import { NextFunction, Request, Response } from 'express';
import {
  getNotificationHistory,
  sendNotification,
} from '../services/notification.service';
import { ValidationError } from '../utils/error.utils';
import { getUserService } from '../services/users.service';

export const sendNotificationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.id;
    const { message, recipients } = req.body;

    const user = await getUserService({ id: userId });

    if (!user.isAdmin) {
      throw new ValidationError('no rights');
    }

    if (!message) {
      throw new ValidationError('Поле message обязателен');
    }

    const result = await sendNotification({
      message,
      recipients: recipients || 'all',
    });

    res.json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getNotificationHistoryController = async (
  req: Request,
  res: Response,
) => {
  try {
    const result = await getNotificationHistory();
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
