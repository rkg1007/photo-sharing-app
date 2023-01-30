import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom.error.error";

export class Unauthorized extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED);
  }
}
