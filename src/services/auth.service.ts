import prisma from "../../prisma/prisma";
import { Error } from "../constants";
import { NotFound, Unauthorized } from "../errors";
import { ILoginData } from "../types";
import { comparePassword, createAccessToken } from "../utils";

const login = async (userData: ILoginData): Promise<string> => {
  const { email, password } = userData;
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new NotFound(Error.USER_NOT_FOUND);
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new Unauthorized(Error.PASSWORD_NOT_MATCHED);
  }

  return createAccessToken({ id: user.id });
};

export default {
  login,
};
