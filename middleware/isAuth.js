const isAuthenticated = (req, res, next) => {
  if (req.session.isAuthenticated) return next();
  res.redirect("/user/login");
};

module.exports = { isAuthenticated };
