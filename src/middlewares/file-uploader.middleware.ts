import multer from "multer";

export const fileUploadHandler = multer({
    storage: multer.diskStorage({
      destination: "public/images",
      filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
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
        return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
      }
    },
  }).single("photo");

