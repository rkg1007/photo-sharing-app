import prisma from "../../prisma/prisma";
import { User } from "@prisma/client"
import { BadRequest, NotFound } from "../errors";
import { ICreateUser, IUpdateUser } from "../types";
import { hashPassword } from "../utils";
import { Error } from "../constants";
import userRepository from "../repositories/user.repository";

const createUser = async (userData: ICreateUser) => {
  const isUserExist = await userRepository.getUser(userData.email)
  
  if (isUserExist) {
    throw new BadRequest(Error.USER_FOUND);
  }

  userData.password = await hashPassword(userData.password);
  const user = await userRepository.createUser(userData)

  return user;
};

const updateUser = async (userEmail: string, updatedData: IUpdateUser) => {
  const user = await userRepository.getUser(userEmail)

  if (!user) {
    throw new NotFound(Error.USER_NOT_FOUND);
  }

  if (updatedData.password) {
    updatedData.password = await hashPassword(updatedData.password);
  }
  const updatedUser = await userRepository.updateUser(userEmail, updatedData);

  return updatedUser;
}

const getUser = async (userEmail: string) => {
    const user = await userRepository.getUser(userEmail)

    if (!user) {
      throw new NotFound(Error.USER_NOT_FOUND);
    }

    return user;
}

export default { createUser, updateUser, getUser };
