import express from 'express';
import morgan from 'morgan';
const app = express();
const PORT = 4000;

const loggerware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  //다음 함수 실행
  next();
};

const privatedMiddleware = (req, res, next) => {
  const url = req.url;
  if(url === '/protected') {
    res.send('<h1>Not Allowed</h1>')
  };
  console.log("Allowed you may continue");
  next();
};

const logger = morgan('common');

// SERVER
// 서버는 항상 커져있는 컴퓨터랑 같음. 인터넷에 연결된 컴퓨터. 
// 항상 request를 listening하고 있다. 

// Basic Logic: app을 만듬(express()) -> 클라이언트에서 오는 다양한 요청에 대해 서버가 어떻게 처리할지 응답을 정의 -> 외부에 개방(listen)

// 👇👇👇 다양한 요청에 대해 어떻게 처리할지 응답을 정의
const handelHome = (req, res, next) => {
  res.json({"data": { "data": "userInfo"}});
}

const handleLogin = (req, res) => {
  res.send({"Login": "here"});
}

const handelProtected = (req, res) => {
  res.send('Welcome to the private lounge.');
}

// 어느 URL에도 작동하는 middleware
// app.use(loggerware);
// app.use(privatedMiddleware);
app.use(logger);

// '/'이라는 주소에 반응하는 콜백함수를 정의
app.get('/', handelHome);
// '/login'이라는 주소에 반응하는 콜백함수를 정의
app.get('/login', handleLogin);
app.get('/protected', handelProtected);

// 그래서 서버가 사람들이 뭔가를 요청할 때까지 기다리게 해야함. 
// 👇👇👇 그것은 바로 app.listen() 
const handleListening = () => console.log(`Server listenin on http://localhost:${PORT} 🍾`);

app.listen(PORT, handleListening);
