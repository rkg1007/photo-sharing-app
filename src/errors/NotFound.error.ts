import { StatusCodes } from "http-status-codes";
import {CustomError} from "./CustomError.error";

export class NotFound extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND);
  }
}
