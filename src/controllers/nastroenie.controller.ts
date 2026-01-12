import { NextFunction, Request, Response } from "express";
import {
  create,
  getForCurrentDay
} from "../services/blagodarnost.service";
import { ValidationError } from "../utils/error.utils";
import { asyncHandler } from "../decorators/asyncHandler";

let userId = 4;
/* const userId = req?.user?.userId;  */// из auth middleware TODO


export const createNastroenie = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getForCurrentDay(userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
  
})