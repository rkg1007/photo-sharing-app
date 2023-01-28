import { StatusCodes } from "http-status-codes";
import { CustomError } from "./CustomError.error";

export class BadRequest extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}
