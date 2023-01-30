import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let msg = err.message;

  if (err instanceof CustomError) {
    statusCode = err.statusCode;
    msg = err.message;
  }

  res.send({ statusCode, msg })
};
