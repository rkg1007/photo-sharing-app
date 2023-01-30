import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Error } from "../constants";
import { Unauthorized } from "../errors";
import { verifyToken } from "../utils";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers["authorization"];
  if (!authorizationHeader) {
    throw new Unauthorized(Error.MISSING_AUTHORIZATION_TOKEN);
  }
  const authorizationsChunks = authorizationHeader.split(" ");
  if (
    authorizationsChunks.length != 2 ||
    authorizationsChunks[0] !== "Bearer"
  ) {
    throw new Unauthorized(Error.INVALID_AUTHORIZATION_TOKEN);
  }
  const jwtToken = authorizationsChunks[1];
  const payload = verifyToken(jwtToken) as JwtPayload;
  req.params.email = payload.email;
  next();
};
