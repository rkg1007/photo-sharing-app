import { StatusCodes } from "http-status-codes";
import multer from "multer";
import path from "path";
import { Error } from "../constants";
import { CustomError } from "../errors";

export const fileUploadHandler = multer({
  storage: multer.diskStorage({
    destination: "public/images",
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new CustomError(Error.INVALID_FILE_EXTENSION, StatusCodes.BAD_REQUEST)
      );
    }
  },
}).single("photo");
