import { Error } from "../constants";
import { NotFound, Unauthorized } from "../errors";
import userRepository from "../repositories/user.repository";
import { ILoginData } from "../types";
import { comparePassword, createAccessToken } from "../utils";

const login = async (userData: ILoginData): Promise<string> => {
  const { email, password } = userData;
  const user = await userRepository.getUser(email, { passwordRequired: true });

  if (!user) {
    throw new NotFound(Error.USER_NOT_FOUND);
  }

  const isPasswordCorrect = await comparePassword(password, user.password);
  if (!isPasswordCorrect) {
    throw new Unauthorized(Error.PASSWORD_NOT_MATCHED);
  }

  return createAccessToken({ email: user.email });
};

export default {
  login,
};
