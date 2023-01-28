import { Router } from "express";
import { fetchPhotos, updatePhotoAccess, uploadPhoto } from "../controllers/photo.controller";
import { authenticate } from "../middlewares";
import { fileUploadHandler } from "../middlewares/file-uploader.middleware";
// import { authenticate } from "../middlewares";

const router = Router();

router
    .route("/")
    .get(authenticate, fetchPhotos)
    .post(authenticate, fileUploadHandler, uploadPhoto);

router
    .route("/:photoId")
    .patch(authenticate, updatePhotoAccess)

export default router;
