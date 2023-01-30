import prisma from "../../prisma/prisma";
import { User } from "@prisma/client"
import { BadRequest, NotFound } from "../errors";
import { ICreateUser, IUpdateUser } from "../types";
import { exclude, hashPassword } from "../utils";
import { Error } from "../constants";

const createUser = async (userData: ICreateUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  
  if (isUserExist) {
    throw new BadRequest(Error.USER_FOUND);
  }

  userData.password = await hashPassword(userData.password);
  const user: User = await prisma.user.create({
    data: userData,
  });

  return exclude(user, ["password"]);
};

const updateUser = async (userId: number, updatedData: IUpdateUser) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new NotFound(Error.USER_NOT_FOUND);
  }

  if (updatedData.password) {
    updatedData.password = await hashPassword(updatedData.password);
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updatedData
  });

  return exclude(updatedUser, ["password"]);
}

const getUser = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    });

    if (!user) {
      throw new NotFound(Error.USER_NOT_FOUND);
    }

    return exclude(user, ["password"]);
}

export default { createUser, updateUser, getUser };
