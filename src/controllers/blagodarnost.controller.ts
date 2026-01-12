import { NextFunction, Request, Response } from "express";
import {
  create,
  getForCurrentDay
} from "../services/blagodarnost.service";
import { ValidationError } from "../utils/error.utils";
import { asyncHandler } from "../decorators/asyncHandler";

let userId = 4;
/* const userId = req?.user?.userId;  */// из auth middleware TODO


export const createBlagodarnost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text } = req.body;

    if (!text) {
      throw new ValidationError('Поле text обязательно', 'text');

    }
    if (text.length > 1000) {
      throw new ValidationError('Текст не должен быть больше 1000 символов', 'text');

    }

    const result = await create(userId, text);

    res.json(result);
  } catch (error) {
    next(error);
  }

})


export const getBlagodarnost = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getForCurrentDay(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
  
})