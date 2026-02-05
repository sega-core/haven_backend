import { NextFunction, Request, Response } from 'express';
import { createMoodService } from '../services/mood.service';
import { ValidationError } from '../utils/error.utils';
import { asyncHandler } from '../decorators/asyncHandler';
import { MOOD_TAGS_MAP } from '../constants/mood.constant';
import { TEMP_USER_ID } from '../app';

//TODO: перевести ошибки на англ

export const createMood = asyncHandler(
  async (
    req: Request<{}, {}, { level: number; comment: string; tags: string[] }>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { level, comment, tags } = req.body;

      if (!level || !comment || !tags) {
        throw new ValidationError('Поля: level, tags, comment обязательны');
      }

      if (tags.length > 3) {
        throw new ValidationError('Максимум 3 тега');
      }

      if (new Set(tags).size !== tags.length) {
        throw new ValidationError('Теги должны быть уникальными');
      }

      tags.forEach((item: any) => {
        if (!MOOD_TAGS_MAP[item]) {
          throw new ValidationError('Недоступный тэг');
        }
        if (MOOD_TAGS_MAP[item].level !== level) {
          throw new ValidationError('Тэг не соостветсвует уровню');
        }
      });

      if (comment.length > 500) {
        throw new ValidationError(
          'Комментарий не должен быть больше 500 символов',
        );
      }

      const result = await createMoodService(TEMP_USER_ID, level, tags, comment);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);