import { Request, Response } from "express";
import { BadRequest } from "../errors";
import authService from "../services/auth.service";
import { StatusCodes } from "http-status-codes";
import { Error } from "../constants";
import { validate } from "../utils";

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequest(Error.MISSING_VALUE);
  }
  validate([{ type: "email", value: email}, { type: "password", value: password}]);
  const token = await authService.login({ email, password });
  res.send({ statusCode: StatusCodes.OK, accessToken: token });
};
