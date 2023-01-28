import prisma from "../../prisma/prisma";
import { User, Photo } from "@prisma/client"
import { BadRequest, NotFound } from "../errors";
import { ICreateUser, IUpdateUser } from "../types";
import { exclude, hashPassword } from "../utils";

const createUser = async (userData: ICreateUser) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      email: userData.email,
    },
  });
  if (isUserExist) {
    throw new BadRequest("user already exists with the given email");
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
    throw new NotFound("user doesn't exists");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: updatedData
  });
  console.log(updatedUser);
  return exclude(updatedUser, ["password"]);
}

const getUser = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        include: {
          photos: true
        }
    });
    if (!user) {
      throw new NotFound("user doesn't exists");
    }

    return exclude(user, ["password"]);
}

const givePhotoAccess = async (userId: number, photoId: number) => {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      photos: {
        connect: {
          id: photoId
        }
      }
    }
  });
}

export default { createUser, updateUser, getUser, givePhotoAccess };
