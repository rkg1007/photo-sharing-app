import { Router } from "express";
import { createUser, getUser, updateUser } from "../controllers";
import { authenticate } from "../middlewares";
import { fileUploadHandler } from "../middlewares/file-uploader.middleware";

const router = Router();

router
    .route("/")
    .post(createUser)
    .patch(authenticate, fileUploadHandler, updateUser)

router
    .route("/me")
    .get(authenticate, getUser)

export default router;