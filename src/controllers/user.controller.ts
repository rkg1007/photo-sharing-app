import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { BadRequest } from "../errors";
import userService from "../services/user.service";
import { Error } from "../constants";
import { validate } from "../utils";

export const createUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequest(Error.MISSING_VALUE);
  }
  validate([
    { type: "email", value: email },
    { type: "password", value: password },
    { type: "name", value: name },
  ]);
  const user = await userService.createUser({ name, email, password });
  res.send({ statusCode: StatusCodes.CREATED, user });
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name && !email && !password && !req.file) {
    throw new BadRequest(Error.NO_FIELD_CHANGED);
  }

  const updatedData: Record<string, string> = {};
  if (name) {
    validate([{ type: "name", value: name }]);
    updatedData.name = name;
  }
  if (email) {
    validate([{ type: "email", value: email }]);
    updatedData.email = email;
  }
  if (password) {
    validate([{ type: "password", value: password }]);
    updatedData.password = password;
  }
  if (req.file) {
    updatedData.image = "http://localhost:5000/images/" + req.file.filename;
  }

  const userId = Number(req.params.userId);
  const user = await userService.updateUser(userId, updatedData);
  res.send({ statusCode: StatusCodes.OK, user });
};

export const getUser = async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = await userService.getUser(userId);
  res.send({ statusCode: StatusCodes.OK, user });
};
