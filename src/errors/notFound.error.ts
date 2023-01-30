import { StatusCodes } from "http-status-codes";
import { CustomError } from "./custom.error.error";

export class NotFound extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
