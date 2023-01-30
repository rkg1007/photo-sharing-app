import dotenv from "dotenv"
dotenv.config();

import express from "express";
import { errorHandler } from "./src/middlewares/errorHandler.middleware";
import authRouter from "./src/routes/auth.route";
import userRouter from "./src/routes/user.route";
import photoRouter from "./src/routes/photo.route";
import { responseHandler } from "./src/middlewares";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/images", express.static(`${__dirname}/public/images/`))

app.use(responseHandler)
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/photos", photoRouter);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is up and running on ${PORT}...`);
});