import { Request, Response, NextFunction } from 'express';

export function asyncHandler<T extends Function>(fn: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}