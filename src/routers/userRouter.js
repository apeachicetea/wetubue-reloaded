import express from 'express';
import { getEdit, postEdit, see, logout, startGithubLogin, finishGithubLogin } from '../controllers/userController.js';
import { protectorMiddleware, publicOnlyMiddleware } from '../middlewares.js';

const userRouter = express.Router();

//protectorMiddleware를 통해 로그인된 유저만 logout페이지에 접근할 수 있게 할 수 있다
userRouter.get("/logout", protectorMiddleware, logout);
//all()메서드는 어떤 method을 사용하든지 이 미들웨어를 사용하는 역활
userRouter.route("/edit").all(protectorMiddleware).get(getEdit).post(postEdit);
//publicOnlyMiddleware를 통해 로그인이 되지 않은 유저만 startGithubLogin,inishGithubLogin페이지에 
//접근할 수 있다
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/:id", see);

export default userRouter;