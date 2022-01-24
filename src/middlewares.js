export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
}

// user가 loggedIn이 되어있다면, 요청을 계속하게 하고
// loggedIn이 되어있지 않다면, 로그인 페이지로 redirect 하게 해준다
export const protectorMiddleware = (req, res, next) => {
  if(req.session.loggedIn) {
    return next();
  }
  else {
    return res.redirect('/login');
  }
};

// user가 loggedIn이 되어있다면, 홈으로 리다이렉트 하게 하고
// loggedIn이 되어있지 않다면, 요청을 계속하게 한다
export const publicOnlyMiddleware = (req, res, next) => {
  if(!req.session.loggedIn) {
    return next();
  }
  else {
    return res.redirect('/');
  }
};