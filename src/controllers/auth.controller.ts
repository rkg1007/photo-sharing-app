import { Request, Response } from "express";
import { BadRequest } from "../errors";
import { asyncWrapper } from "../utils";
import authService from "../services/auth.service";
import { StatusCodes } from "http-status-codes";

export const loginUser = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest(
      "missing either one or more values from email and password"
    );
  }

  const token = await authService.login({ email, password });
  res.status(StatusCodes.OK).json({ accessToken: token });
});

