import prisma from "../../prisma/prisma";
import { ICreateUser, IUpdateUser } from "../types";

const createUser = (userData: ICreateUser) => {
    return prisma.user.create({ data: userData, select: {name: true, email: true, image: true} })
}

const getUser = (email: string, options = { passwordRequired: false }) => {
    console.log(email);
  return prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      name: true,
      email: true,
      image: true,
      password: options.passwordRequired,
    },
  });
};

const getUserById = (userId: number) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        image: true,
      },
    });
}


const updateUser = (userEmail: string, updatedData: IUpdateUser) => {
    return prisma.user.update({
        where: {
            email: userEmail
        },
        data: updatedData,
        select: {
            name: true,
            email: true,
            image: true
        }
    })
}

export default {
  createUser,
  getUser,
  updateUser,
  getUserById,
};