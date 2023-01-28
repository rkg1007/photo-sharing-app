import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError.error";

export class Unauthorized extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
