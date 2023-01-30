import { Router } from "express";
import {
  fetchPhotos,
  updatePhotoAccess,
  uploadPhoto,
} from "../controllers/photo.controller";
import { authenticate, fileUploadHandler } from "../middlewares";
import { asyncWrapper } from "../utils";

const router = Router();

router
  .route("/")
  .get(asyncWrapper(authenticate), asyncWrapper(fetchPhotos))
  .post(
    asyncWrapper(authenticate),
    asyncWrapper(fileUploadHandler),
    asyncWrapper(uploadPhoto)
  );

router
  .route("/:photoId")
  .patch(asyncWrapper(authenticate), asyncWrapper(updatePhotoAccess));

export default router;
