import User from '../models/User.js';
import fetch from 'node-fetch';
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
  const user = await User.findOne({ username, socialOnly: false });
  if(!user) {
    return res.status(400).render('login', { pageTitle, errorMessage: "An account with this username does not exists"});
  }
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) {
    return res.status(400).render('login', { pageTitle, errorMessage: "Wrong password"});
  }
  req.session.loggedIn = true;
  req.session.user = user;
  res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email"
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  res.redirect(finalUrl);
};

export const finishGithubLogin = async(req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  }
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (await fetch(finalUrl, {
    method: "POST",
    headers: { Accept: "application/json" }
  })).json();

  if("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (await fetch(`${apiUrl}/user`, {
      headers: {
        Authorization: `token ${access_token}`
      }
    })).json();
    const emailData = await (await fetch(`${apiUrl}/user/emails`, {
      headers: {
        Authorization: `token ${access_token}`
      }
    })).json();
    const emailObj = emailData.find(email => email.primary === true && email.verified === true);
    if(!emailObj) {
      return res.redirect("/login");
    }
    //github로그인으로 접속해서 찾은 email이 기존 DB에 있다면 그냥 로그인시켜준다
    //DB에 일치한 유저데이터가 없다면 회원가입을 할 수 있게 한다(깃헙에서 제공받은 유저정보를 기반하여)
    //github을 이용해 계정을 만들었다면 password는 없는 상태이다
    //그렇다면 username, password form을 사용할 수 없다
    //user model에서 정의한 socialonly속성을 true로 변경해주어 로그인 상태로 바꿔 줄 수 있다
    let user = await User.findOne({ email: emailObj.email });
    if(!user) {
      user = await User.create({
        avartarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login,
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");

  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  res.render("edit-profile", { pageTitle: "Edit Profile"})
};
export const postEdit = (req, res) => {
  res.render("edit-profile", { pageTitle: "Edit Profile" })
};
export const see = (req, res) => res.send('See User');
