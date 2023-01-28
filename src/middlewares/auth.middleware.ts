import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Unauthorized } from "../errors";
import { verifyToken } from "../utils";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers["authorization"];
    if (!authorizationHeader) {
        throw new Unauthorized("authorization token is missing");
    }
    const authorizationsChunks = authorizationHeader.split(" ");
    if (authorizationsChunks.length != 2 || authorizationsChunks[0] !== "Bearer") {
      throw new Unauthorized("invalid authorization header");
    }
    const jwtToken = authorizationsChunks[1];
    const payload = verifyToken(jwtToken) as JwtPayload;
    req.params.userId = payload.id;
    next();
}