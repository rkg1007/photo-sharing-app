import { Router } from "express";
import { loginUser } from "../controllers";
import { asyncWrapper } from "../utils";

const router = Router();

router.route("/login").post(asyncWrapper(loginUser));

export default router;
 