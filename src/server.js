import express from 'express';
import morgan from 'morgan';
import session from 'express-session';
import rootRouter from './routers/rootRouter';
import userRouter from './routers/userRouter';
import videoRouter from './routers/videoRouter';

const app = express();
const logger = morgan('tiny');

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views")
app.use(logger);
app.use(express.urlencoded({ extended: true }));

// express-session 미들웨어 
// 라우터 전에 선언해주어야 한다
// 아래와 같이 세팅을 해주게 되면 브라우저가 서버에 요청할때 이 미들웨어가 브라우저에게 텍스트(세션id)를 전달해주게 되고
// 서버는 브라우저 요청시 같이 오는 텍스트(세션id)로인해 이 브라우저가 어떤 유저인지 구별할 수 있게 되고
// 유저에 따라 필요한 정보들을 유저에게 줄 수 있게 된다
app.use(session({
  secret: "Hello!",
  resave: true,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  console.log(req.headers);
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
  })
  next();
})

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
