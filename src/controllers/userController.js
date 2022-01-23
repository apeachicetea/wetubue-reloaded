import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";
  if(password !== password2) {
    return res.status(400).render("join", { pageTitle, errorMessage: "Password confrimation does not match" });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if(exists) {
    return res.status(400).render("join", { pageTitle, errorMessage: "This username or email is already taken" });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location
    });
    res.redirect('/login');
  }
  catch(error) {
    res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error._message});
  }
};
export const getLogin = (req, res) => res.render('login', { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  const user = await User.findOne({ username });
  if(!user) {
    return res.status(400).render('login', { pageTitle, errorMessage: "An account with this username does not exists"});
  }

  //bcrypt.compare(유저가입력한비밀번호, DB에 저장되어 있는 해싱된값);
  //그럼 compare매서드가 알아서 유저가 입력한 비밀번호를 해싱해서 DB에 저장되어 있는 해싱된 값이랑 비교해서
  //같으면 true, 다르면 false를 리턴한다
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) {
    return res.status(400).render('login', { pageTitle, errorMessage: "Wrong password"});
  }
  //세션객체에 접근하려면 req.session으로 하면 된다 
  //아래와 같이 로그인이 성공하면 세션객체에 loggedIn, user 정보를 추가해준 것이다
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const config = {
    clientId: "d3d00d97b312d3854eea",
    allow_signup: false,
    scope: "read:user user:email"
  };
  const params = new URLSearchParams(config).toString();
  console.log(params);
  const baseUrl = `https://github.com/login/oauth/authorize?${params}`;
};

export const edit = (req, res) => res.send('Edit User');
export const remove = (req, res) => res.send('Remove User');
export const see = (req, res) => res.send('See User');
export const logout = (req, res) => res.send('Logout');
