import { Router } from "express";
import { createUser, getUser, updateUser } from "../controllers";
import { authenticate, fileUploadHandler } from "../middlewares";
import { asyncWrapper } from "../utils";

const router = Router();

router
  .route("/")
  .post(asyncWrapper(createUser))
  .patch(
    asyncWrapper(authenticate),
    asyncWrapper(fileUploadHandler),
    asyncWrapper(updateUser)
  );

router.route("/me").get(asyncWrapper(authenticate), asyncWrapper(getUser));

export default router;
