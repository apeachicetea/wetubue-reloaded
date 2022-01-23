import express from 'express';
import { edit, remove, see, logout, startGithubLogin } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/github/start", startGithubLogin);
userRouter.get("/:id", see);

export default userRouter;