import { Router } from "express";
import { loginUser } from "../controllers";

const router = Router();

router.route("/login").post(loginUser);

export default router;
 