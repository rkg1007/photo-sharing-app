import jwt from "jsonwebtoken";
import { Unauthorized } from "../errors";

export const createAccessToken = (payload: any): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  return jwt.sign(payload, jwtSecret);
};

export const verifyToken = (token: string) => {
  const jwtSecret = process.env.JWT_SECRET as string;
  try {
    return jwt.verify(token, jwtSecret);
  } catch (error) {
    throw new Unauthorized("authorization token is invalid");
  }
};
