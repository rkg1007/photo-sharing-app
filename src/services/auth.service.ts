import prisma from "../../prisma/prisma";
import { NotFound, Unauthorized } from "../errors";
import { ILoginData } from "../types";
import { comparePassword, createAccessToken } from "../utils";

const login = async (userData: ILoginData): Promise<string> => {
  const { email, password } = userData;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFound("user doesn't exists with given email");
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new Unauthorized("password doesn't match");
  }

  return createAccessToken({ id: user.id });
};

export default {
  login,
};
