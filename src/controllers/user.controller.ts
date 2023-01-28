import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { BadRequest } from "../errors";
import userService from "../services/user.service";
import { asyncWrapper } from "../utils/async-wrapper";

export const createUser = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequest(
      "missing either one or more values from name, email and password"
    );
  }

  const user = await userService.createUser({ name, email, password });
  res.status(StatusCodes.CREATED).json({data: user});
});

export const updateUser = asyncWrapper(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name && !email && !password && !req.file) {
    throw new BadRequest("no field is changed");
  }
  
  const updatedData: Record<string, string> = {}
  if (name) updatedData.name = name;
  if (email) updatedData.email = email;
  if (password) updatedData.password = password;
  if (req.file) {
    updatedData.image = "http://localhost:5000/images/" + req.file.filename;
  }

  const userId = Number(req.params.userId);
  const user = await userService.updateUser(userId, updatedData);
  res.status(StatusCodes.OK).json({ data: user });
});

export const getUser = asyncWrapper(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const user = await userService.getUser(userId);
  res.status(StatusCodes.OK).json({ data: user })
});
