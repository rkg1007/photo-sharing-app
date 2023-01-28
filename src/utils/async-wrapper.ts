import { Request, Response, NextFunction } from "express";

export const asyncWrapper = (fn: Function) => {
  return function (req: Request, res: Response, next: NextFunction) {
    return fn(req, res, next).catch((err: Error) => {
      next(err);
    });
  };
}
